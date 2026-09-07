<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\User;

test('index returns an empty cart when there is no identity', function () {
    $response = $this->getJson('/api/cart');

    $response->assertOk();
    $response->assertJson(['data' => ['id' => null, 'items' => [], 'item_count' => 0, 'subtotal_cents' => 0]]);
});

test('index returns the guest cart for a matching token', function () {
    $token = fake()->uuid();
    $cart = Cart::factory()->create(['user_id' => null, 'guest_token' => $token]);
    $size = ProductSize::factory()->create(['price_cents' => 1500]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 3]);

    $response = $this->withHeader('X-Guest-Token', $token)->getJson('/api/cart');

    $response->assertOk();
    expect($response->json('data.items'))->toHaveCount(1);
    expect($response->json('data.item_count'))->toBe(3);
    expect($response->json('data.subtotal_cents'))->toBe(4500);
});

test('index returns the authenticated user cart', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $size = ProductSize::factory()->create(['price_cents' => 1000]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 2]);

    $response = $this->actingAs($user)->getJson('/api/cart');

    $response->assertOk();
    expect($response->json('data.item_count'))->toBe(2);
});

test('a guest can add an item to the cart', function () {
    $size = ProductSize::factory()->create();
    $token = fake()->uuid();

    $response = $this->withHeader('X-Guest-Token', $token)->postJson('/api/cart/items', [
        'product_id' => $size->product_id,
        'product_size_id' => $size->id,
        'quantity' => 2,
    ]);

    // A brand-new guest cart is created on the first add, so Laravel's
    // resource response reports 201 rather than 200.
    $response->assertSuccessful();
    expect($response->json('data.items'))->toHaveCount(1);
    expect(Cart::where('guest_token', $token)->first()->items)->toHaveCount(1);
});

test('adding a matching line sums quantity clamped to 99', function () {
    $user = User::factory()->create();
    $size = ProductSize::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 95]);

    $response = $this->actingAs($user)->postJson('/api/cart/items', [
        'product_id' => $size->product_id,
        'product_size_id' => $size->id,
        'quantity' => 10,
    ]);

    $response->assertOk();
    expect($response->json('data.items'))->toHaveCount(1);
    expect($response->json('data.items.0.quantity'))->toBe(99);
});

test('adding an item requires either a guest token or authentication', function () {
    $size = ProductSize::factory()->create();

    $this->postJson('/api/cart/items', [
        'product_id' => $size->product_id,
        'product_size_id' => $size->id,
        'quantity' => 1,
    ])->assertUnprocessable();
});

test('adding an item rejects a size that does not belong to the product', function () {
    $otherSize = ProductSize::factory()->create();
    $product = Product::factory()->create();
    $token = fake()->uuid();

    $response = $this->withHeader('X-Guest-Token', $token)->postJson('/api/cart/items', [
        'product_id' => $product->id,
        'product_size_id' => $otherSize->id,
        'quantity' => 1,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('product_size_id');
});

test('adding an item rejects an inactive product', function () {
    $product = Product::factory()->create(['is_active' => false]);
    $size = ProductSize::factory()->create(['product_id' => $product->id]);
    $token = fake()->uuid();

    $response = $this->withHeader('X-Guest-Token', $token)->postJson('/api/cart/items', [
        'product_id' => $product->id,
        'product_size_id' => $size->id,
        'quantity' => 1,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('product_id');
});

test('a cart item quantity can be set directly, up to 99', function () {
    $user = User::factory()->create();
    $size = ProductSize::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $item = CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);

    $response = $this->actingAs($user)->patchJson("/api/cart/items/{$item->id}", ['quantity' => 99]);

    $response->assertOk();
    expect($response->json('data.items.0.quantity'))->toBe(99);
});

test('updating a cart item rejects a quantity above 99', function () {
    $user = User::factory()->create();
    $size = ProductSize::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $item = CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);

    $response = $this->actingAs($user)->patchJson("/api/cart/items/{$item->id}", ['quantity' => 500]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('quantity');
});

test('updating a cart item to quantity 0 removes it', function () {
    $user = User::factory()->create();
    $size = ProductSize::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $item = CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);

    $response = $this->actingAs($user)->patchJson("/api/cart/items/{$item->id}", ['quantity' => 0]);

    $response->assertOk();
    expect($response->json('data.items'))->toHaveCount(0);
    expect(CartItem::find($item->id))->toBeNull();
});

test('a user cannot modify an item belonging to another cart', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $size = ProductSize::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $owner->id]);
    $item = CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);

    $this->actingAs($intruder)->patchJson("/api/cart/items/{$item->id}", ['quantity' => 5])->assertNotFound();
    $this->actingAs($intruder)->deleteJson("/api/cart/items/{$item->id}")->assertNotFound();
});

test('a cart item can be removed', function () {
    $user = User::factory()->create();
    $size = ProductSize::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $item = CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 1]);

    $response = $this->actingAs($user)->deleteJson("/api/cart/items/{$item->id}");

    $response->assertOk();
    expect(CartItem::find($item->id))->toBeNull();
});

test('the merge endpoint merges the guest cart for the authenticated user', function () {
    $user = User::factory()->create();
    $size = ProductSize::factory()->create();
    $token = fake()->uuid();

    $guestCart = Cart::factory()->create(['user_id' => null, 'guest_token' => $token]);
    CartItem::factory()->create(['cart_id' => $guestCart->id, 'product_id' => $size->product_id, 'product_size_id' => $size->id, 'quantity' => 4]);

    $response = $this->actingAs($user)->withHeader('X-Guest-Token', $token)->postJson('/api/cart/merge');

    $response->assertOk();
    expect($response->json('data.item_count'))->toBe(4);
    expect(Cart::find($guestCart->id))->toBeNull();
});

test('the merge endpoint requires authentication', function () {
    $this->postJson('/api/cart/merge')->assertUnauthorized();
});
