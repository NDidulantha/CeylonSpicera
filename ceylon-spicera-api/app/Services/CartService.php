<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\User;

class CartService
{
    /**
     * Find the cart identified by the given user, or by a guest token when
     * there is no authenticated user, without creating one if it doesn't
     * already exist.
     */
    public function findCart(?User $user, ?string $guestToken): ?Cart
    {
        if ($user) {
            return Cart::query()->where('user_id', $user->id)->first();
        }

        if ($guestToken) {
            return Cart::query()->where('guest_token', $guestToken)->first();
        }

        return null;
    }

    /**
     * Find or create the cart identified by the given user, or by a guest
     * token when there is no authenticated user. Returns null when neither
     * identity is available — there is nothing to resolve a cart against.
     */
    public function findOrCreateCart(?User $user, ?string $guestToken): ?Cart
    {
        if ($user) {
            return Cart::query()->firstOrCreate(['user_id' => $user->id]);
        }

        if ($guestToken) {
            return Cart::query()->firstOrCreate(
                ['guest_token' => $guestToken],
                ['expires_at' => now()->addDays(30)],
            );
        }

        return null;
    }

    /**
     * Merge a guest cart (identified by its token) into the given user's
     * cart, summing quantities on matching lines and clamping to 99.
     */
    public function mergeGuestCartIntoUser(User $user, ?string $guestToken): void
    {
        if (! $guestToken) {
            return;
        }

        $guestCart = Cart::query()
            ->whereNull('user_id')
            ->where('guest_token', $guestToken)
            ->first();

        if (! $guestCart) {
            return;
        }

        $userCart = Cart::query()->firstOrCreate(['user_id' => $user->id]);

        foreach ($guestCart->items as $guestItem) {
            $existing = $userCart->items()
                ->where('product_id', $guestItem->product_id)
                ->where('product_size_id', $guestItem->product_size_id)
                ->first();

            if ($existing) {
                $existing->update([
                    'quantity' => min(99, $existing->quantity + $guestItem->quantity),
                ]);
            } else {
                $userCart->items()->create([
                    'product_id' => $guestItem->product_id,
                    'product_size_id' => $guestItem->product_size_id,
                    'quantity' => min(99, $guestItem->quantity),
                ]);
            }
        }

        $guestCart->delete();
    }
}
