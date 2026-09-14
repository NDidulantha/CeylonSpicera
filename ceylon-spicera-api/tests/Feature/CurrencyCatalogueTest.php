<?php

use App\Models\Currency;

test('lists currencies ordered by code with display-only rates', function () {
    Currency::factory()->create(['code' => 'LKR', 'rate_to_usd' => 300]);
    Currency::factory()->create(['code' => 'EUR', 'rate_to_usd' => 0.92]);

    $response = $this->getJson('/api/currencies');

    $response->assertOk();
    $data = $response->json('data');

    expect($data[0]['code'])->toBe('EUR');
    expect($data[1]['code'])->toBe('LKR');
    expect((float) $data[1]['rate_to_usd'])->toBe(300.0);
});
