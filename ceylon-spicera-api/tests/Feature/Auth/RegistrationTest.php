<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('a user can register', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'shipping_region' => 'United Kingdom',
        'marketing_opt_in' => true,
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.email', 'ada@example.com');
    $response->assertJsonMissing(['password']);

    $user = User::where('email', 'ada@example.com')->firstOrFail();
    expect(Hash::check('Password123!', $user->password))->toBeTrue();
    expect($user->shipping_region)->toBe('United Kingdom');
    expect($user->marketing_opt_in)->toBeTrue();
});

test('registration does not log the user in', function () {
    $this->postJson('/api/auth/register', [
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ])->assertCreated();

    $this->getJson('/api/auth/me')->assertUnauthorized();
});

test('registration requires a matching password confirmation', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'something-else',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('password');
});

test('registration requires a unique email', function () {
    User::factory()->create(['email' => 'ada@example.com']);

    $response = $this->postJson('/api/auth/register', [
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('email');
});

test('register requests are rate limited', function () {
    $payload = fn (int $i) => [
        'name' => 'Ada Lovelace',
        'email' => "ada{$i}@example.com",
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ];

    for ($i = 0; $i < 3; $i++) {
        $this->postJson('/api/auth/register', $payload($i))->assertCreated();
    }

    $this->postJson('/api/auth/register', $payload(99))->assertStatus(429);
});
