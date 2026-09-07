<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductSize;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

test('a user can log in with correct credentials', function () {
    $user = User::factory()->create(['password' => 'Password123!']);

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'Password123!',
    ]);

    $response->assertOk();
    $response->assertJsonPath('data.email', $user->email);
    $this->assertAuthenticatedAs($user);
});

test('login fails with incorrect credentials', function () {
    $user = User::factory()->create(['password' => 'Password123!']);

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('email');
    $this->assertGuest();
});

test('login merges the guest cart into the user cart', function () {
    $user = User::factory()->create(['password' => 'Password123!']);
    $size = ProductSize::factory()->create(['stock_quantity' => 100]);
    $guestToken = fake()->uuid();

    $guestCart = Cart::factory()->create(['user_id' => null, 'guest_token' => $guestToken]);
    CartItem::factory()->create([
        'cart_id' => $guestCart->id,
        'product_id' => $size->product_id,
        'product_size_id' => $size->id,
        'quantity' => 2,
    ]);

    $response = $this->withHeader('X-Guest-Token', $guestToken)->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'Password123!',
    ]);

    $response->assertOk();

    $userCart = Cart::where('user_id', $user->id)->first();
    expect($userCart)->not->toBeNull();
    expect($userCart->items)->toHaveCount(1);
    expect($userCart->items->first()->quantity)->toBe(2);
    expect(Cart::find($guestCart->id))->toBeNull();
});

test('login merge sums quantities for a matching size already in the user cart', function () {
    $user = User::factory()->create(['password' => 'Password123!']);
    $size = ProductSize::factory()->create();
    $guestToken = fake()->uuid();

    $userCart = Cart::factory()->create(['user_id' => $user->id, 'guest_token' => null]);
    CartItem::factory()->create([
        'cart_id' => $userCart->id,
        'product_id' => $size->product_id,
        'product_size_id' => $size->id,
        'quantity' => 98,
    ]);

    $guestCart = Cart::factory()->create(['user_id' => null, 'guest_token' => $guestToken]);
    CartItem::factory()->create([
        'cart_id' => $guestCart->id,
        'product_id' => $size->product_id,
        'product_size_id' => $size->id,
        'quantity' => 5,
    ]);

    $this->withHeader('X-Guest-Token', $guestToken)->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'Password123!',
    ])->assertOk();

    $userCart->refresh();
    expect($userCart->items)->toHaveCount(1);
    expect($userCart->items->first()->quantity)->toBe(99);
});

test('a user can log out', function () {
    $user = User::factory()->create(['password' => 'Password123!']);

    $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'Password123!',
    ])->assertOk();

    $this->getJson('/api/auth/me')->assertOk();

    $this->postJson('/api/auth/logout')->assertOk();

    // Sanctum's "sanctum" guard is a RequestGuard that caches its resolved
    // user for its lifetime. In a real app that lifetime is one request; in
    // tests it's the whole test method's shared container, so it must be
    // forgotten here to see the effect of logout on the next simulated
    // request — this has no bearing on real request/response cycles.
    Auth::forgetGuards();

    $this->getJson('/api/auth/me')->assertUnauthorized();
});

test('me returns 401 when unauthenticated', function () {
    $this->getJson('/api/auth/me')->assertUnauthorized();
});

test('login requests are rate limited per email and ip', function () {
    $user = User::factory()->create(['password' => 'Password123!']);

    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertStatus(429);
});
