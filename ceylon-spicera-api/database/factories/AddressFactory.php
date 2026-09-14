<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['shipping', 'billing']),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'company' => null,
            'country' => fake()->country(),
            'street' => fake()->streetAddress(),
            'apartment' => null,
            'city' => fake()->city(),
            'state' => fake()->state(),
            'postcode' => fake()->postcode(),
            'phone' => fake()->phoneNumber(),
            'is_default' => false,
        ];
    }
}
