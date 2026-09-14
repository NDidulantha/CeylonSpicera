<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    /**
     * Create a new account. Does not log the user in — the front end
     * redirects to sign-in after a successful registration.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->string('name')->value(),
            'email' => $request->string('email')->lower()->value(),
            'password' => $request->string('password')->value(),
            'shipping_region' => $request->input('shipping_region'),
            'marketing_opt_in' => $request->boolean('marketing_opt_in'),
        ]);

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    /**
     * Authenticate and start a stateful SPA session. Merges the guest
     * cart identified by the X-Guest-Token header, if present.
     */
    public function login(LoginRequest $request): UserResource
    {
        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => [trans('auth.failed')],
            ]);
        }

        $request->session()->regenerate();

        $this->cartService->mergeGuestCartIntoUser($request->user(), $request->header('X-Guest-Token'));

        return new UserResource($request->user());
    }

    /**
     * End the current session.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out.']);
    }

    /**
     * The currently authenticated user, or 401 via the auth:sanctum middleware.
     */
    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Send a password reset link. Always responds the same way regardless
     * of whether the email exists, to avoid account enumeration.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        Password::sendResetLink($request->only('email'));

        return response()->json(['message' => 'If that email exists, a reset link has been sent.']);
    }

    /**
     * Reset a password using the token from the reset link.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => $password])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [trans($status)],
            ]);
        }

        return response()->json(['message' => 'Password reset successfully.']);
    }
}
