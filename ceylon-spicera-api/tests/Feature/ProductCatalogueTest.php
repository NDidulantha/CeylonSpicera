<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;

test('index only lists active products', function () {
    Product::factory()->create(['name' => 'Active One', 'is_active' => true]);
    Product::factory()->create(['name' => 'Inactive One', 'is_active' => false]);

    $response = $this->getJson('/api/products');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);
    expect($response->json('data.0.name'))->toBe('Active One');
});

test('index searches by name or short description', function () {
    Product::factory()->create(['name' => 'Ceylon Cinnamon Quills', 'short_description' => 'Grade C5']);
    Product::factory()->create(['name' => 'Malabar Black Pepper', 'short_description' => 'Bold single origin']);
    Product::factory()->create(['name' => 'Green Cardamom Pods', 'short_description' => 'Contains cinnamon notes']);

    $response = $this->getJson('/api/products?search=cinnamon');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(2);
    $names = collect($response->json('data'))->pluck('name');
    expect($names)->toContain('Ceylon Cinnamon Quills', 'Green Cardamom Pods');
});

test('index filters by category slug', function () {
    $pepper = Category::factory()->create(['name' => 'Pepper', 'slug' => 'pepper']);
    $cinnamon = Category::factory()->create(['name' => 'Cinnamon', 'slug' => 'cinnamon']);

    Product::factory()->count(2)->create(['category_id' => $pepper->id]);
    Product::factory()->count(3)->create(['category_id' => $cinnamon->id]);

    $response = $this->getJson('/api/products?category=pepper');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(2);
});

test('index filters by min and max price', function () {
    Product::factory()->create(['name' => 'Cheap', 'base_price_cents' => 1000]);
    Product::factory()->create(['name' => 'Mid', 'base_price_cents' => 3500]);
    Product::factory()->create(['name' => 'Expensive', 'base_price_cents' => 9000]);

    $response = $this->getJson('/api/products?min_price=30&max_price=50');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);
    expect($response->json('data.0.name'))->toBe('Mid');
});

test('index sorts by price low to high', function () {
    Product::factory()->create(['name' => 'B', 'base_price_cents' => 2000]);
    Product::factory()->create(['name' => 'A', 'base_price_cents' => 1000]);
    Product::factory()->create(['name' => 'C', 'base_price_cents' => 3000]);

    $response = $this->getJson('/api/products?sort=low');

    expect(collect($response->json('data'))->pluck('name')->all())->toBe(['A', 'B', 'C']);
});

test('index sorts by price high to low', function () {
    Product::factory()->create(['name' => 'B', 'base_price_cents' => 2000]);
    Product::factory()->create(['name' => 'A', 'base_price_cents' => 1000]);
    Product::factory()->create(['name' => 'C', 'base_price_cents' => 3000]);

    $response = $this->getJson('/api/products?sort=high');

    expect(collect($response->json('data'))->pluck('name')->all())->toBe(['C', 'B', 'A']);
});

test('index sorts by top rated', function () {
    Product::factory()->create(['name' => 'Low Rated', 'rating' => 4.2]);
    Product::factory()->create(['name' => 'Top Rated', 'rating' => 5.0]);
    Product::factory()->create(['name' => 'Mid Rated', 'rating' => 4.7]);

    $response = $this->getJson('/api/products?sort=top');

    expect(collect($response->json('data'))->pluck('name')->all())
        ->toBe(['Top Rated', 'Mid Rated', 'Low Rated']);
});

test('index sorts alphabetically a-z', function () {
    Product::factory()->create(['name' => 'Zesty Lime']);
    Product::factory()->create(['name' => 'Apple Spice']);
    Product::factory()->create(['name' => 'Malabar Pepper']);

    $response = $this->getJson('/api/products?sort=az');

    expect(collect($response->json('data'))->pluck('name')->all())
        ->toBe(['Apple Spice', 'Malabar Pepper', 'Zesty Lime']);
});

test('index defaults to featured sort using sort_order', function () {
    Product::factory()->create(['name' => 'Third', 'sort_order' => 3]);
    Product::factory()->create(['name' => 'First', 'sort_order' => 1]);
    Product::factory()->create(['name' => 'Second', 'sort_order' => 2]);

    $response = $this->getJson('/api/products');

    expect(collect($response->json('data'))->pluck('name')->all())
        ->toBe(['First', 'Second', 'Third']);
});

test('index paginates results', function () {
    Product::factory()->count(7)->create();

    $response = $this->getJson('/api/products?per_page=3&page=2');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(3);
    expect($response->json('meta.current_page'))->toBe(2);
    expect($response->json('meta.last_page'))->toBe(3);
    expect($response->json('meta.total'))->toBe(7);
});

test('featured only returns featured active products ordered by sort_order', function () {
    Product::factory()->create(['name' => 'Not Featured', 'is_featured' => false]);
    Product::factory()->create(['name' => 'Featured Second', 'is_featured' => true, 'sort_order' => 2]);
    Product::factory()->create(['name' => 'Featured First', 'is_featured' => true, 'sort_order' => 1]);
    Product::factory()->create(['name' => 'Featured Inactive', 'is_featured' => true, 'is_active' => false]);

    $response = $this->getJson('/api/products/featured');

    $response->assertOk();
    expect(collect($response->json('data'))->pluck('name')->all())
        ->toBe(['Featured First', 'Featured Second']);
});

test('show returns a single active product with sizes and images', function () {
    $product = Product::factory()
        ->has(ProductSize::factory()->count(3), 'sizes')
        ->has(ProductImage::factory()->count(2), 'images')
        ->create(['slug' => 'ceylon-cinnamon-quills']);

    $response = $this->getJson("/api/products/{$product->slug}");

    $response->assertOk();
    $response->assertJsonPath('data.slug', 'ceylon-cinnamon-quills');
    expect($response->json('data.sizes'))->toHaveCount(3);
    expect($response->json('data.images'))->toHaveCount(2);
});

test('show returns 404 for an inactive product', function () {
    $product = Product::factory()->create(['slug' => 'hidden-product', 'is_active' => false]);

    $this->getJson("/api/products/{$product->slug}")->assertNotFound();
});

test('show returns 404 for an unknown slug', function () {
    $this->getJson('/api/products/does-not-exist')->assertNotFound();
});
