<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\PromoCode;
use App\Models\ShippingRate;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class PricingService
{
    /**
     * Compute the full order-of-operations pricing breakdown for a set of
     * cart or order lines. This is the only place money is calculated —
     * controllers must not do arithmetic on prices.
     *
     * @param  Collection<int, CartItem>  $lines  Each line must have its productSize loaded.
     * @return array{subtotal_cents: int, discount_cents: int, shipping_cents: int, gift_wrap_cents: int, duty_cents: int, total_cents: int}
     */
    public function calculate(
        Collection $lines,
        ?PromoCode $promo,
        ShippingRate $shippingRate,
        bool $giftWrap,
        string $shippingCountry,
    ): array {
        $subtotal = $lines->sum(fn ($line) => $line->productSize->price_cents * $line->quantity);

        $discount = $this->discountFor($subtotal, $promo);

        $afterDiscount = $subtotal - $discount;

        $shipping = $shippingRate->price_cents;
        if ($shippingRate->free_above_cents !== null && $afterDiscount >= $shippingRate->free_above_cents) {
            $shipping = 0;
        }

        $giftWrapCents = $giftWrap ? config('pricing.gift_wrap_cents') : 0;

        $duty = $this->isDutyExempt($shippingCountry)
            ? 0
            : (int) round($afterDiscount * config('pricing.duty_rate'));

        $total = $afterDiscount + $shipping + $giftWrapCents + $duty;

        return [
            'subtotal_cents' => $subtotal,
            'discount_cents' => $discount,
            'shipping_cents' => $shipping,
            'gift_wrap_cents' => $giftWrapCents,
            'duty_cents' => $duty,
            'total_cents' => $total,
        ];
    }

    /**
     * Look up a promo code by its (case-insensitive) code, or return null
     * when no code was given. Throws a validation error for an unknown code.
     */
    public function findPromoOrFail(?string $code): ?PromoCode
    {
        if ($code === null || $code === '') {
            return null;
        }

        $promo = PromoCode::query()->whereRaw('UPPER(code) = ?', [strtoupper($code)])->first();

        if (! $promo) {
            throw ValidationException::withMessages(['promo_code' => ['This promo code does not exist.']]);
        }

        return $promo;
    }

    /**
     * Assert that a promo code is eligible to be applied to the given
     * subtotal for the given user, throwing a validation error otherwise.
     */
    public function assertPromoEligible(PromoCode $promo, int $subtotalCents, ?User $user): void
    {
        $error = match (true) {
            ! $promo->is_active => 'This promo code is no longer active.',
            $promo->starts_at && now()->lt($promo->starts_at) => 'This promo code is not active yet.',
            $promo->expires_at && now()->gt($promo->expires_at) => 'This promo code has expired.',
            $subtotalCents < $promo->min_subtotal_cents => 'This promo code requires a higher order subtotal.',
            $promo->usage_limit !== null && $promo->used_count >= $promo->usage_limit => 'This promo code has reached its usage limit.',
            $promo->per_user_limit !== null && $user && $this->timesUsedBy($promo, $user) >= $promo->per_user_limit => 'You have already used this promo code.',
            default => null,
        };

        if ($error !== null) {
            throw ValidationException::withMessages(['promo_code' => [$error]]);
        }
    }

    private function discountFor(int $subtotalCents, ?PromoCode $promo): int
    {
        if (! $promo) {
            return 0;
        }

        return match ($promo->type) {
            'percent' => (int) round($subtotalCents * $promo->value / 100),
            'fixed' => min($promo->value, $subtotalCents),
        };
    }

    private function isDutyExempt(string $shippingCountry): bool
    {
        return strcasecmp(trim($shippingCountry), config('pricing.duty_exempt_country')) === 0;
    }

    private function timesUsedBy(PromoCode $promo, User $user): int
    {
        return $user->orders()
            ->where('promo_code_id', $promo->id)
            ->where('status', '!=', 'cancelled')
            ->count();
    }
}
