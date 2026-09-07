<?php

use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\PromoCode;
use Illuminate\Support\Facades\Mail;

function payhereSignature(string $merchantId, string $orderId, string $amount, string $currency, string $statusCode, string $secret): string
{
    $secretHash = strtoupper(md5($secret));

    return strtoupper(md5($merchantId.$orderId.$amount.$currency.$statusCode.$secretHash));
}

function payherePayload(Order $order, string $statusCode = '2', array $overrides = []): array
{
    $merchantId = 'TEST12345';
    $secret = 'test-secret';
    $amount = number_format($order->settlement_amount / 100, 2, '.', '');
    $currency = $order->settlement_currency;

    return array_merge([
        'merchant_id' => $merchantId,
        'order_id' => $order->reference,
        'payment_id' => '3200'.$order->id,
        'payhere_amount' => $amount,
        'payhere_currency' => $currency,
        'status_code' => $statusCode,
        'method' => 'VISA',
        'card_no' => '************1234',
        'md5sig' => payhereSignature($merchantId, $order->reference, $amount, $currency, $statusCode, $secret),
    ], $overrides);
}

beforeEach(function () {
    config([
        'services.payhere.merchant_id' => 'TEST12345',
        'services.payhere.merchant_secret' => 'test-secret',
    ]);
});

test('a valid successful notification marks the order paid and records the payment', function () {
    Mail::fake();

    $order = Order::factory()->create(['status' => 'pending', 'settlement_amount' => 150000, 'settlement_currency' => 'LKR']);
    $product = Product::factory()->create(['stock_quantity' => 10]);
    OrderItem::factory()->for($order)->create(['product_id' => $product->id, 'quantity' => 3]);

    $response = $this->postJson('/api/payments/payhere/notify', payherePayload($order));

    $response->assertOk();

    $order->refresh();
    expect($order->status)->toBe('paid');
    expect($order->paid_at)->not->toBeNull();

    $payment = Payment::where('order_id', $order->id)->firstOrFail();
    expect($payment->status)->toBe('success');
    expect($payment->card_last4)->toBe('1234');
    expect($payment->gateway)->toBe('payhere');

    expect($product->fresh()->stock_quantity)->toBe(7);

    Mail::assertQueued(OrderConfirmationMail::class, fn ($mail) => $mail->order->id === $order->id);
});

test('an invalid signature is rejected and does not mark the order paid', function () {
    $order = Order::factory()->create(['status' => 'pending', 'settlement_amount' => 150000, 'settlement_currency' => 'LKR']);

    $payload = payherePayload($order);
    $payload['md5sig'] = 'not-a-real-signature';

    $response = $this->postJson('/api/payments/payhere/notify', $payload);

    $response->assertStatus(400);
    expect($order->fresh()->status)->toBe('pending');
    expect(Payment::where('order_id', $order->id)->exists())->toBeFalse();
});

test('a duplicate delivery for the same payment id is idempotent', function () {
    Mail::fake();

    $order = Order::factory()->create(['status' => 'pending', 'settlement_amount' => 150000, 'settlement_currency' => 'LKR']);
    $payload = payherePayload($order);

    $this->postJson('/api/payments/payhere/notify', $payload)->assertOk();
    $this->postJson('/api/payments/payhere/notify', $payload)->assertOk();

    expect(Payment::where('order_id', $order->id)->count())->toBe(1);
    Mail::assertQueued(OrderConfirmationMail::class, 1);
});

test('a mismatched amount is rejected', function () {
    $order = Order::factory()->create(['status' => 'pending', 'settlement_amount' => 150000, 'settlement_currency' => 'LKR']);

    $merchantId = 'TEST12345';
    $secret = 'test-secret';
    $tamperedAmount = '1.00';
    $payload = [
        'merchant_id' => $merchantId,
        'order_id' => $order->reference,
        'payment_id' => '320099',
        'payhere_amount' => $tamperedAmount,
        'payhere_currency' => 'LKR',
        'status_code' => '2',
        'md5sig' => payhereSignature($merchantId, $order->reference, $tamperedAmount, 'LKR', '2', $secret),
    ];

    $response = $this->postJson('/api/payments/payhere/notify', $payload);

    $response->assertStatus(400);
    expect($order->fresh()->status)->toBe('pending');
});

test('an unknown order reference is rejected', function () {
    $merchantId = 'TEST12345';
    $secret = 'test-secret';
    $payload = [
        'merchant_id' => $merchantId,
        'order_id' => 'CS-2026-9999',
        'payment_id' => '320099',
        'payhere_amount' => '100.00',
        'payhere_currency' => 'LKR',
        'status_code' => '2',
        'md5sig' => payhereSignature($merchantId, 'CS-2026-9999', '100.00', 'LKR', '2', $secret),
    ];

    $this->postJson('/api/payments/payhere/notify', $payload)->assertStatus(404);
});

test('a pending status code does not mark the order paid', function () {
    $order = Order::factory()->create(['status' => 'pending', 'settlement_amount' => 150000, 'settlement_currency' => 'LKR']);

    $this->postJson('/api/payments/payhere/notify', payherePayload($order, '0'))->assertOk();

    expect($order->fresh()->status)->toBe('pending');
    expect(Payment::where('order_id', $order->id)->first()->status)->toBe('pending');
});

test('a successful payment increments the promo code used_count', function () {
    Mail::fake();

    $promo = PromoCode::factory()->create(['used_count' => 4]);
    $order = Order::factory()->create([
        'status' => 'pending',
        'settlement_amount' => 150000,
        'settlement_currency' => 'LKR',
        'promo_code_id' => $promo->id,
    ]);

    $this->postJson('/api/payments/payhere/notify', payherePayload($order))->assertOk();

    expect($promo->fresh()->used_count)->toBe(5);
});

test('the return endpoint redirects to the front end without trusting the status', function () {
    $order = Order::factory()->create(['reference' => 'CS-2026-0042', 'status' => 'pending']);

    $response = $this->get('/api/payments/payhere/return?order_id=CS-2026-0042&status_code=2');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('/checkout?reference=CS-2026-0042');
    expect($order->fresh()->status)->toBe('pending');
});
