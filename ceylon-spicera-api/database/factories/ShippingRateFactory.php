<?php

namespace Database\Factories;

use App\Models\ShippingRate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShippingRate>
 */
class ShippingRateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'key' => fake()->unique()->word(),
            'name' => fake()->words(2, true),
            'eta' => '8-12 working days',
            'price_cents' => 950,
            'free_above_cents' => null,
            'is_active' => true,
        ];
    }
}
