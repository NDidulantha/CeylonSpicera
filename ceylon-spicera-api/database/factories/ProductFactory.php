<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####-??')),
            'base_price_cents' => fake()->numberBetween(1000, 9500),
            'short_description' => fake()->sentence(),
            'long_description' => fake()->paragraph(),
            'badge' => null,
            'stock_status' => 'in',
            'stock_quantity' => fake()->numberBetween(10, 200),
            'estate' => fake()->randomElement(['Matale', 'Kandy', 'Kegalle', 'Kandenuwara']),
            'harvest_month' => fake()->monthName().' '.fake()->year(),
            'lot_number' => strtoupper(fake()->bothify('P?-##')),
            'rating' => fake()->randomFloat(1, 4, 5),
            'review_count' => fake()->numberBetween(0, 300),
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
