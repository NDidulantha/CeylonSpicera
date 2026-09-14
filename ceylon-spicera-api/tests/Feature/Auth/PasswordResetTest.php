<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

test('forgot-password sends a reset link notification for an existing user', function () {
    Notification::fake();

    $user = User::factory()->create();

    $response = $this->postJson('/api/auth/forgot-password', ['email' => $user->email]);

    $response->assertOk();
    Notification::assertSentTo($user, ResetPassword::class);
});

test('forgot-password responds the same way for an unknown email', function () {
    Notification::fake();

    $response = $this->postJson('/api/auth/forgot-password', ['email' => 'nobody@example.com']);

    $response->assertOk();
    Notification::assertNothingSent();
});

test('the reset link points to the front end', function () {
    Notification::fake();

    $user = User::factory()->create();
    $this->postJson('/api/auth/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user) {
        $url = $notification->toMail($user)->actionUrl;

        return str_starts_with($url, config('app.frontend_url').'/account/reset-password?token=');
    });
});

test('a user can reset their password with a valid token', function () {
    $user = User::factory()->create();
    $token = Password::createToken($user);

    $response = $this->postJson('/api/auth/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'NewPassword456!',
    ]);

    $response->assertOk();
    expect(Hash::check('NewPassword456!', $user->fresh()->password))->toBeTrue();
});

test('reset-password fails with an invalid token', function () {
    $user = User::factory()->create();

    $response = $this->postJson('/api/auth/reset-password', [
        'token' => 'not-a-real-token',
        'email' => $user->email,
        'password' => 'NewPassword456!',
    ]);

    $response->assertUnprocessable();
});
