<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\PromoCode;
use App\Models\ShippingRate;
use App\Models\User;

function validAddress(array $overrides = []): array
{
    return array_merge([
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
        'country' => 'United States',
        'street' => '1 Analytical Engine Way',
        'city' => 'London',
        'postcode' => '90210',
    ], $overrides);
}

test('an order can be created from the cart, recomputing money server-side', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create(['price_cents' => 2000]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 3]);
    ShippingRate::factory()->create(['key' => 'standard', 'price_cents' => 950, 'free_above_cents' => null, 'is_active' => true]);

    $response = $this->actingAs($user)->postJson('/api/orders', [
        'shipping_address' => validAddress(),
        'billing_address' => validAddress(),
        'shipping_key' => 'standard',
        'gift_wrap' => false,
    ]);

    $response->assertCreated();
    expect($response->json('data.subtotal_cents'))->toBe(6000);
    expect($response->json('data.shipping_cents'))->toBe(950);
    expect($response->json('data.status'))->toBe('pending');
    expect($response->json('data.reference'))->toMatch('/^CS-\d{4}-\d{4}$/');
    expect($response->json('data.items'))->toHaveCount(1);

    expect(Order::count())->toBe(1);
    expect($cart->fresh()->items)->toHaveCount(0);
});

test('a tampered client price is ignored — the server recomputes from the database', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create(['price_cents' => 2000]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);
    ShippingRate::factory()->create(['key' => 'standard', 'price_cents' => 950, 'free_above_cents' => null, 'is_active' => true]);

    $response = $this->actingAs($user)->postJson('/api/orders', [
        'shipping_address' => validAddress(['country' => 'Sri Lanka']),
        'billing_address' => validAddress(['country' => 'Sri Lanka']),
        'shipping_key' => 'standard',
        // None of these are accepted fields — the server must ignore them entirely.
        'subtotal_cents' => 1,
        'total_cents' => 1,
        'price_cents' => 1,
    ]);

    $response->assertCreated();

    $order = Order::firstOrFail();
    expect($order->subtotal_cents)->toBe(2000);
    expect($order->total_cents)->toBe(2950);
});

test('an order is rejected when the cart is empty', function () {
    $user = User::factory()->create();
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);

    $response = $this->actingAs($user)->postJson('/api/orders', [
        'shipping_address' => validAddress(),
        'billing_address' => validAddress(),
        'shipping_key' => 'standard',
    ]);

    $response->assertUnprocessable();
    expect(Order::count())->toBe(0);
});

test('an order is rejected when a cart product is inactive', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['is_active' => false]);
    $size = ProductSize::factory()->create(['product_id' => $product->id]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $product->id, 'product_size_id' => $size->id, 'quantity' => 1]);
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);

    $response = $this->actingAs($user)->postJson('/api/orders', [
        'shipping_address' => validAddress(),
        'billing_address' => validAddress(),
        'shipping_key' => 'standard',
    ]);

    $response->assertUnprocessable();
    expect(Order::count())->toBe(0);
});

test('an order is rejected when there is insufficient stock', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create(['stock_quantity' => 2]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 5]);
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);

    $response = $this->actingAs($user)->postJson('/api/orders', [
        'shipping_address' => validAddress(),
        'billing_address' => validAddress(),
        'shipping_key' => 'standard',
    ]);

    $response->assertUnprocessable();
    expect(Order::count())->toBe(0);
});

test('an order applies a valid promo code and matches the quote breakdown', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create(['price_cents' => 10000]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);
    ShippingRate::factory()->create(['key' => 'standard', 'price_cents' => 950, 'free_above_cents' => null, 'is_active' => true]);
    PromoCode::factory()->create(['code' => 'HARVEST10', 'type' => 'percent', 'value' => 10]);

    $response = $this->actingAs($user)->postJson('/api/orders', [
        'shipping_address' => validAddress(['country' => 'Sri Lanka']),
        'billing_address' => validAddress(['country' => 'Sri Lanka']),
        'shipping_key' => 'standard',
        'promo_code' => 'harvest10',
    ]);

    $response->assertCreated();
    expect($response->json('data.discount_cents'))->toBe(1000);
    expect($response->json('data.duty_cents'))->toBe(0);
});

test('the order snapshots addresses and does not link them by foreign key', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create();
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);

    $response = $this->actingAs($user)->postJson('/api/orders', [
        'shipping_address' => validAddress(['city' => 'Colombo']),
        'billing_address' => validAddress(['city' => 'Colombo']),
        'shipping_key' => 'standard',
    ]);

    $response->assertCreated();
    expect($response->json('data.shipping_address.city'))->toBe('Colombo');

    $order = Order::firstOrFail();
    expect($order->shipping_address)->toBeArray();
});

test('order creation requires authentication', function () {
    ShippingRate::factory()->create(['key' => 'standard', 'is_active' => true]);

    $this->postJson('/api/orders', [
        'shipping_address' => validAddress(),
        'billing_address' => validAddress(),
        'shipping_key' => 'standard',
    ])->assertUnauthorized();
});
