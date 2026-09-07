<?php

namespace Database\Factories;

use App\Models\PromoCode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PromoCode>
 */
class PromoCodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('PROMO##')),
            'type' => 'percent',
            'value' => fake()->numberBetween(5, 25),
            'min_subtotal_cents' => 0,
            'usage_limit' => null,
            'used_count' => 0,
            'per_user_limit' => null,
            'starts_at' => null,
            'expires_at' => null,
            'is_active' => true,
        ];
    }
}
