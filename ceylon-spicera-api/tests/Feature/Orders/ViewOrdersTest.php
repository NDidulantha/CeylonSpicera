<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

test('index lists only the authenticated user own orders', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    Order::factory()->for($user)->create();
    Order::factory()->for($other)->create();

    $response = $this->actingAs($user)->getJson('/api/orders');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);
});

test('show returns a single order with its items', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create(['reference' => 'CS-2026-0001']);
    OrderItem::factory()->for($order)->create();

    $response = $this->actingAs($user)->getJson('/api/orders/CS-2026-0001');

    $response->assertOk();
    $response->assertJsonPath('data.reference', 'CS-2026-0001');
    expect($response->json('data.items'))->toHaveCount(1);
});

test('show 404s for another user order', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    Order::factory()->for($other)->create(['reference' => 'CS-2026-0002']);

    $this->actingAs($user)->getJson('/api/orders/CS-2026-0002')->assertNotFound();
});

test('orders endpoints require authentication', function () {
    $this->getJson('/api/orders')->assertUnauthorized();
    $this->getJson('/api/orders/CS-2026-0001')->assertUnauthorized();
});
