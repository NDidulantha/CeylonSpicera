<?php

use App\Models\CartItem;
use App\Models\Order;
use App\Models\ProductSize;
use App\Models\PromoCode;
use App\Models\ShippingRate;
use App\Models\User;
use App\Services\PricingService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

function pricingLine(int $priceCents, int $quantity): CartItem
{
    $size = ProductSize::factory()->create(['price_cents' => $priceCents]);

    return CartItem::factory()->create([
        'product_id' => $size->product_id,
        'product_size_id' => $size->id,
        'quantity' => $quantity,
    ]);
}

beforeEach(function () {
    $this->pricing = new PricingService;
});

test('the full order of operations is applied in sequence', function () {
    $lines = new Collection([pricingLine(2000, 3)]); // subtotal 6000
    $promo = PromoCode::factory()->create(['type' => 'percent', 'value' => 10]); // discount 600
    $rate = ShippingRate::factory()->create(['price_cents' => 950, 'free_above_cents' => null]);

    $result = $this->pricing->calculate($lines, $promo, $rate, giftWrap: true, shippingCountry: 'United States');

    expect($result['subtotal_cents'])->toBe(6000);
    expect($result['discount_cents'])->toBe(600);
    expect($result['shipping_cents'])->toBe(950);
    expect($result['gift_wrap_cents'])->toBe(600);
    // afterDiscount = 5400, duty = round(5400 * 0.045) = 243
    expect($result['duty_cents'])->toBe(243);
    // total = 5400 + 950 + 600 + 243
    expect($result['total_cents'])->toBe(7193);
});

test('shipping is free exactly at the threshold, charged just under it', function () {
    $rate = ShippingRate::factory()->create(['price_cents' => 950, 'free_above_cents' => 7500]);

    $underThreshold = new Collection([pricingLine(7499, 1)]);
    $atThreshold = new Collection([pricingLine(7500, 1)]);

    $under = $this->pricing->calculate($underThreshold, null, $rate, giftWrap: false, shippingCountry: 'Sri Lanka');
    $at = $this->pricing->calculate($atThreshold, null, $rate, giftWrap: false, shippingCountry: 'Sri Lanka');

    expect($under['shipping_cents'])->toBe(950);
    expect($at['shipping_cents'])->toBe(0);
});

test('a promo that drops the after-discount subtotal below the free-shipping threshold causes shipping to be charged', function () {
    $rate = ShippingRate::factory()->create(['price_cents' => 950, 'free_above_cents' => 7500]);
    $promo = PromoCode::factory()->create(['type' => 'fixed', 'value' => 2000]);

    // subtotal 8000, after 2000 fixed discount -> 6000, below the 7500 threshold
    $lines = new Collection([pricingLine(8000, 1)]);

    $result = $this->pricing->calculate($lines, $promo, $rate, giftWrap: false, shippingCountry: 'Sri Lanka');

    expect($result['discount_cents'])->toBe(2000);
    expect($result['shipping_cents'])->toBe(950);
});

test('duty is zero for shipments to Sri Lanka', function () {
    $rate = ShippingRate::factory()->create(['price_cents' => 950, 'free_above_cents' => null]);
    $lines = new Collection([pricingLine(10000, 1)]);

    $result = $this->pricing->calculate($lines, null, $rate, giftWrap: false, shippingCountry: 'Sri Lanka');

    expect($result['duty_cents'])->toBe(0);
});

test('duty is charged at 4.5 percent for shipments outside Sri Lanka', function () {
    $rate = ShippingRate::factory()->create(['price_cents' => 950, 'free_above_cents' => null]);
    $lines = new Collection([pricingLine(10000, 1)]);

    $result = $this->pricing->calculate($lines, null, $rate, giftWrap: false, shippingCountry: 'United States');

    expect($result['duty_cents'])->toBe((int) round(10000 * 0.045));
});

test('a percent promo discounts a percentage of the subtotal', function () {
    $rate = ShippingRate::factory()->create();
    $promo = PromoCode::factory()->create(['type' => 'percent', 'value' => 15]);
    $lines = new Collection([pricingLine(5000, 2)]); // subtotal 10000

    $result = $this->pricing->calculate($lines, $promo, $rate, giftWrap: false, shippingCountry: 'Sri Lanka');

    expect($result['discount_cents'])->toBe(1500);
});

test('a fixed promo discounts a flat number of cents, capped at the subtotal', function () {
    $rate = ShippingRate::factory()->create();
    $promo = PromoCode::factory()->create(['type' => 'fixed', 'value' => 5000]);
    $lines = new Collection([pricingLine(1000, 1)]); // subtotal 1000, discount capped at 1000

    $result = $this->pricing->calculate($lines, $promo, $rate, giftWrap: false, shippingCountry: 'Sri Lanka');

    expect($result['discount_cents'])->toBe(1000);
    expect($result['total_cents'])->toBeGreaterThanOrEqual(0);
});

test('an inactive promo is not eligible', function () {
    $promo = PromoCode::factory()->create(['is_active' => false]);

    expect(fn () => $this->pricing->assertPromoEligible($promo, 10000, null))
        ->toThrow(ValidationException::class);
});

test('a promo before its start date is not eligible', function () {
    $promo = PromoCode::factory()->create(['starts_at' => now()->addDay()]);

    expect(fn () => $this->pricing->assertPromoEligible($promo, 10000, null))
        ->toThrow(ValidationException::class);
});

test('an expired promo is not eligible', function () {
    $promo = PromoCode::factory()->create(['expires_at' => now()->subDay()]);

    expect(fn () => $this->pricing->assertPromoEligible($promo, 10000, null))
        ->toThrow(ValidationException::class);
});

test('a promo below its minimum subtotal is not eligible', function () {
    $promo = PromoCode::factory()->create(['min_subtotal_cents' => 5000]);

    expect(fn () => $this->pricing->assertPromoEligible($promo, 4999, null))
        ->toThrow(ValidationException::class);
});

test('a promo at exactly its minimum subtotal is eligible', function () {
    $promo = PromoCode::factory()->create(['min_subtotal_cents' => 5000]);

    $this->pricing->assertPromoEligible($promo, 5000, null);

    expect(true)->toBeTrue();
});

test('a promo at its total usage limit is not eligible', function () {
    $promo = PromoCode::factory()->create(['usage_limit' => 2, 'used_count' => 2]);

    expect(fn () => $this->pricing->assertPromoEligible($promo, 10000, null))
        ->toThrow(ValidationException::class);
});

test('a promo already used by this user up to their per-user limit is not eligible', function () {
    $user = User::factory()->create();
    $promo = PromoCode::factory()->create(['per_user_limit' => 1]);
    Order::factory()->for($user)->create(['promo_code_id' => $promo->id, 'status' => 'paid']);

    expect(fn () => $this->pricing->assertPromoEligible($promo, 10000, $user))
        ->toThrow(ValidationException::class);
});

test('a cancelled order does not count toward the per-user limit', function () {
    $user = User::factory()->create();
    $promo = PromoCode::factory()->create(['per_user_limit' => 1]);
    Order::factory()->for($user)->create(['promo_code_id' => $promo->id, 'status' => 'cancelled']);

    $this->pricing->assertPromoEligible($promo, 10000, $user);

    expect(true)->toBeTrue();
});
