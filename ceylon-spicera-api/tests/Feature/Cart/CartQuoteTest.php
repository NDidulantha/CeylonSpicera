<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductSize;
use App\Models\PromoCode;
use App\Models\ShippingRate;
use App\Models\User;

test('quote returns the full pricing breakdown for the current cart', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create(['price_cents' => 5000]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 2]);
    $rate = ShippingRate::factory()->create(['key' => 'standard', 'price_cents' => 950, 'free_above_cents' => null, 'is_active' => true]);

    $response = $this->actingAs($user)->getJson('/api/cart/quote?'.http_build_query([
        'shipping_key' => 'standard',
        'country' => 'United States',
        'gift_wrap' => 0,
    ]));

    $response->assertOk();
    expect($response->json('data.subtotal_cents'))->toBe(10000);
    expect($response->json('data.shipping_cents'))->toBe(950);
    expect($response->json('data.duty_cents'))->toBe((int) round(10000 * 0.045));
});

test('quote applies a valid promo code', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create(['price_cents' => 10000]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);
    PromoCode::factory()->create(['code' => 'HARVEST10', 'type' => 'percent', 'value' => 10]);

    $response = $this->actingAs($user)->getJson('/api/cart/quote?'.http_build_query([
        'shipping_key' => 'standard',
        'country' => 'Sri Lanka',
        'promo_code' => 'harvest10',
    ]));

    $response->assertOk();
    expect($response->json('data.discount_cents'))->toBe(1000);
    expect($response->json('data.promo_code.code'))->toBe('HARVEST10');
});

test('quote rejects an unknown promo code', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create();
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);

    $response = $this->actingAs($user)->getJson('/api/cart/quote?'.http_build_query([
        'shipping_key' => 'standard',
        'country' => 'Sri Lanka',
        'promo_code' => 'NOTREAL',
    ]));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('promo_code');
});

test('quote rejects an ineligible promo code', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create(['price_cents' => 1000]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);
    PromoCode::factory()->create(['code' => 'MATALE15', 'min_subtotal_cents' => 5000]);

    $response = $this->actingAs($user)->getJson('/api/cart/quote?'.http_build_query([
        'shipping_key' => 'standard',
        'country' => 'Sri Lanka',
        'promo_code' => 'MATALE15',
    ]));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('promo_code');
});

test('quote requires a non-empty cart', function () {
    $user = User::factory()->create();
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);

    $response = $this->actingAs($user)->getJson('/api/cart/quote?'.http_build_query([
        'shipping_key' => 'standard',
        'country' => 'Sri Lanka',
    ]));

    $response->assertUnprocessable();
});

test('quote requires a valid active shipping key', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create();
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);

    $response = $this->actingAs($user)->getJson('/api/cart/quote?'.http_build_query([
        'shipping_key' => 'does-not-exist',
        'country' => 'Sri Lanka',
    ]));

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('shipping_key');
});
