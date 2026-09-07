<?php

use App\Models\Order;
use App\Models\User;

beforeEach(function () {
    config([
        'services.payhere.merchant_id' => 'TEST12345',
        'services.payhere.merchant_secret' => 'test-secret',
        'pricing.usd_to_lkr_rate' => 300,
    ]);
});

test('initiate returns a correctly signed payload and stores the settlement snapshot', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create(['status' => 'pending', 'total_cents' => 5000]);

    $response = $this->actingAs($user)->postJson('/api/payments/payhere/initiate', [
        'order_reference' => $order->reference,
    ]);

    $response->assertOk();
    $response->assertJsonPath('data.merchant_id', 'TEST12345');
    $response->assertJsonPath('data.order_id', $order->reference);
    $response->assertJsonPath('data.amount', '15000.00'); // 5000 cents * 300 = 1,500,000 cents = 15000.00
    $response->assertJsonPath('data.currency', 'LKR');

    $secretHash = strtoupper(md5('test-secret'));
    $expectedHash = strtoupper(md5('TEST12345'.$order->reference.'15000.00'.'LKR'.$secretHash));
    $response->assertJsonPath('data.hash', $expectedHash);

    $order->refresh();
    expect((float) $order->fx_rate)->toBe(300.0);
    expect($order->settlement_amount)->toBe(1500000);
});

test('initiate requires authentication', function () {
    $order = Order::factory()->create(['status' => 'pending']);

    $this->postJson('/api/payments/payhere/initiate', ['order_reference' => $order->reference])
        ->assertUnauthorized();
});

test('initiate rejects an order belonging to another user', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $order = Order::factory()->for($owner)->create(['status' => 'pending']);

    $this->actingAs($intruder)->postJson('/api/payments/payhere/initiate', [
        'order_reference' => $order->reference,
    ])->assertNotFound();
});

test('initiate rejects an order that is not pending', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create(['status' => 'paid']);

    $this->actingAs($user)->postJson('/api/payments/payhere/initiate', [
        'order_reference' => $order->reference,
    ])->assertUnprocessable();
});
