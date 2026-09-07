<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductSize>
 */
class ProductSizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'size_key' => '100g',
            'label' => '100 g',
            'multiplier' => 1.00,
            'price_cents' => fake()->numberBetween(1000, 9500),
            'stock_quantity' => fake()->numberBetween(10, 200),
        ];
    }
}
