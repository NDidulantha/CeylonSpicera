<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\User;
use App\Models\Wishlist;

test('product schema and relationships persist correctly', function () {
    $product = Product::factory()
        ->has(ProductSize::factory()->count(3), 'sizes')
        ->create();

    expect($product->sizes)->toHaveCount(3);
    expect($product->category)->not->toBeNull();
});

test('cart, wishlist and order schemas persist correctly', function () {
    $user = User::factory()->create();
    $size = ProductSize::factory()->create();

    $cart = Cart::factory()->for($user)->create();
    CartItem::factory()->for($cart)->for($size->product)->for($size, 'productSize')->create();

    Wishlist::factory()->for($user)->create();

    $order = Order::factory()->for($user)->create();
    OrderItem::factory()->for($order)->create();
    Payment::factory()->for($order)->create();

    expect($cart->items)->toHaveCount(1);
    expect($user->wishlist)->toHaveCount(1);
    expect($order->items)->toHaveCount(1);
    expect($order->payments)->toHaveCount(1);
});
