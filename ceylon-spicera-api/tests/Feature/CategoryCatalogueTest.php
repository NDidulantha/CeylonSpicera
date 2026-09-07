<?php

use App\Models\Category;
use App\Models\Product;

test('index lists categories ordered by sort_order with active product counts', function () {
    $pepper = Category::factory()->create(['name' => 'Pepper', 'sort_order' => 1]);
    $cinnamon = Category::factory()->create(['name' => 'Cinnamon', 'sort_order' => 0]);

    Product::factory()->count(2)->create(['category_id' => $cinnamon->id, 'is_active' => true]);
    Product::factory()->count(1)->create(['category_id' => $cinnamon->id, 'is_active' => false]);
    Product::factory()->count(3)->create(['category_id' => $pepper->id, 'is_active' => true]);

    $response = $this->getJson('/api/categories');

    $response->assertOk();
    $data = $response->json('data');

    expect($data[0]['name'])->toBe('Cinnamon');
    expect($data[0]['product_count'])->toBe(2);
    expect($data[1]['name'])->toBe('Pepper');
    expect($data[1]['product_count'])->toBe(3);
});
