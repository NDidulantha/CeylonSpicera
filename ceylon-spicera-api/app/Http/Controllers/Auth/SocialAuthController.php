<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;

class SocialAuthController extends Controller
{
    /**
     * Redirect the browser to the provider's own consent screen. This is a
     * full page navigation triggered by the user clicking a link, not a
     * fetch — CORS and CSRF don't apply here.
     */
    public function redirect(Request $request, string $provider): RedirectResponse
    {
        $request->session()->put('social_return_to', $request->query('return_to', '/'));

        // Facebook doesn't grant email by default without this scope; an
        // account without an email can't be matched or created below.
        return Socialite::driver($provider)->scopes(['email'])->redirect();
    }

    /**
     * Handle the provider's redirect back. Finds an existing account by
     * email (linking it to this provider if it wasn't already), or creates
     * a new one, then logs the browser's session in and sends it straight
     * back to the storefront — the user never sees a second login step.
     */
    public function callback(Request $request, string $provider): RedirectResponse
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $returnTo = $request->session()->pull('social_return_to', '/');

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (InvalidStateException $e) {
            Log::warning('Social login state mismatch', ['provider' => $provider]);

            return redirect()->away("{$frontendUrl}/account?social_error=1");
        }

        if (! $socialUser->getEmail()) {
            Log::warning('Social login provided no email', ['provider' => $provider]);

            return redirect()->away("{$frontendUrl}/account?social_error=no_email");
        }

        $user = User::query()->where('email', $socialUser->getEmail())->first();

        if ($user) {
            if (! $user->provider) {
                $user->forceFill(['provider' => $provider, 'provider_id' => $socialUser->getId()])->save();
            }
        } else {
            $user = User::query()->create([
                'name' => $socialUser->getName() ?: $socialUser->getNickname() ?: 'Ceylon Spicera Customer',
                'email' => $socialUser->getEmail(),
                'email_verified_at' => now(),
                'password' => null,
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
            ]);
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->away("{$frontendUrl}{$returnTo}");
    }
}
