<?php

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;

test('wishlist endpoints require authentication', function () {
    $product = Product::factory()->create();

    $this->getJson('/api/wishlist')->assertUnauthorized();
    $this->postJson("/api/wishlist/{$product->id}")->assertUnauthorized();
    $this->deleteJson("/api/wishlist/{$product->id}")->assertUnauthorized();
});

test('index lists the authenticated user wishlisted products', function () {
    $user = User::factory()->create();
    $wishlisted = Product::factory()->create(['name' => 'Wishlisted']);
    Product::factory()->create(['name' => 'Not Wishlisted']);

    Wishlist::factory()->create(['user_id' => $user->id, 'product_id' => $wishlisted->id]);

    $response = $this->actingAs($user)->getJson('/api/wishlist');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);
    expect($response->json('data.0.name'))->toBe('Wishlisted');
});

test('a product can be added to the wishlist', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)->postJson("/api/wishlist/{$product->id}")->assertOk();

    expect(Wishlist::where('user_id', $user->id)->where('product_id', $product->id)->exists())->toBeTrue();
});

test('adding a product to the wishlist twice is idempotent', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)->postJson("/api/wishlist/{$product->id}")->assertOk();
    $this->actingAs($user)->postJson("/api/wishlist/{$product->id}")->assertOk();

    expect(Wishlist::where('user_id', $user->id)->where('product_id', $product->id)->count())->toBe(1);
});

test('a product can be removed from the wishlist', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    Wishlist::factory()->create(['user_id' => $user->id, 'product_id' => $product->id]);

    $this->actingAs($user)->deleteJson("/api/wishlist/{$product->id}")->assertOk();

    expect(Wishlist::where('user_id', $user->id)->where('product_id', $product->id)->exists())->toBeFalse();
});
