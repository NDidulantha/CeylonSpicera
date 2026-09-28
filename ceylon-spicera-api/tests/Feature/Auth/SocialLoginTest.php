<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

function fakeSocialUser(string $id, string $email, string $name): SocialiteUser
{
    return (new SocialiteUser)->map(['id' => $id, 'email' => $email, 'name' => $name]);
}

test('redirect sends the browser to the provider', function () {
    Socialite::fake('google', fakeSocialUser('1', 'a@example.com', 'A'));

    $response = $this->get('/auth/google/redirect');

    $response->assertRedirect('https://socialite.fake/google/authorize');
});

test('rejects an unsupported provider', function () {
    $this->get('/auth/twitter/redirect')->assertNotFound();
});

test('callback creates a new account and logs the browser in', function () {
    Socialite::fake('google', fakeSocialUser('goog-1', 'newcustomer@example.com', 'New Customer'));

    $response = $this->get('/auth/google/callback');

    $response->assertRedirect(config('app.frontend_url').'/');

    $user = User::query()->where('email', 'newcustomer@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->provider)->toBe('google');
    expect($user->provider_id)->toBe('goog-1');
    expect($user->password)->toBeNull();
    $this->assertAuthenticatedAs($user);
});

test('callback links an existing password account by email instead of duplicating it', function () {
    $existing = User::factory()->create(['email' => 'returning@example.com', 'password' => 'Password123!']);

    Socialite::fake('facebook', fakeSocialUser('fb-1', 'returning@example.com', 'Returning'));

    $this->get('/auth/facebook/callback')->assertRedirect(config('app.frontend_url').'/');

    expect(User::query()->where('email', 'returning@example.com')->count())->toBe(1);
    $existing->refresh();
    expect($existing->provider)->toBe('facebook');
    expect($existing->provider_id)->toBe('fb-1');
    $this->assertAuthenticatedAs($existing);
});

test('redirects back to the return_to path captured before the redirect', function () {
    Socialite::fake('google', fakeSocialUser('goog-2', 'checkout@example.com', 'Checkout User'));

    $this->get('/auth/google/redirect?return_to=%2Fcheckout');
    $response = $this->get('/auth/google/callback');

    $response->assertRedirect(config('app.frontend_url').'/checkout');
});

test('rejects a provider account with no email and does not log anyone in', function () {
    $socialUser = (new SocialiteUser)->map(['id' => 'goog-3', 'email' => null, 'name' => 'No Email']);
    Socialite::fake('google', $socialUser);

    $response = $this->get('/auth/google/callback');

    $response->assertRedirect(config('app.frontend_url').'/account?social_error=no_email');
    $this->assertGuest();
});
