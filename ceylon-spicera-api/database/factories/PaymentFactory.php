<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'gateway' => 'payhere',
            'gateway_payment_id' => fake()->unique()->numerify('##########'),
            'status' => 'success',
            'amount' => fake()->numberBetween(300000, 3000000),
            'currency' => 'LKR',
            'method' => 'VISA',
            'card_last4' => fake()->numerify('####'),
            'raw_payload' => ['status_code' => '2'],
        ];
    }
}
