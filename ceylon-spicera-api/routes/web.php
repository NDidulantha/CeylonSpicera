<?php

use App\Http\Controllers\Auth\SocialAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Full browser redirects (not fetch/AJAX) — the provider itself navigates
// the user's browser to the callback URL, so this lives outside /api and
// outside Sanctum's stateful-API handling.
Route::prefix('auth/{provider}')->where(['provider' => 'google|facebook'])->group(function () {
    Route::get('/redirect', [SocialAuthController::class, 'redirect'])->name('social.redirect');
    Route::get('/callback', [SocialAuthController::class, 'callback'])->name('social.callback');
});
