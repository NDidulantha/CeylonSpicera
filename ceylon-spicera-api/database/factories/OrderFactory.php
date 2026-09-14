<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(1000, 20000);
        $shipping = 950;
        $total = $subtotal + $shipping;

        return [
            'user_id' => User::factory(),
            'reference' => 'CS-'.now()->year.'-'.str_pad((string) fake()->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'status' => 'pending',
            'subtotal_cents' => $subtotal,
            'discount_cents' => 0,
            'shipping_cents' => $shipping,
            'gift_wrap_cents' => 0,
            'duty_cents' => 0,
            'total_cents' => $total,
            'currency' => 'USD',
            'settlement_currency' => 'LKR',
            'settlement_amount' => null,
            'fx_rate' => null,
            'promo_code_id' => null,
            'shipping_rate_key' => 'standard',
            'gift_wrap' => false,
            'gift_message' => null,
            'customer_notes' => null,
            'shipping_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'country' => fake()->country(),
                'street' => fake()->streetAddress(),
                'city' => fake()->city(),
                'postcode' => fake()->postcode(),
            ],
            'billing_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'country' => fake()->country(),
                'street' => fake()->streetAddress(),
                'city' => fake()->city(),
                'postcode' => fake()->postcode(),
            ],
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'placed_at' => now(),
            'paid_at' => null,
            'shipped_at' => null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }
}
