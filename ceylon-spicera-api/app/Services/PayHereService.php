<?php

namespace App\Services;

use App\Models\Order;

class PayHereService
{
    /**
     * Build the PayHere checkout initiate payload for an order, converting
     * its USD total to LKR and persisting the settlement snapshot. Includes
     * the non-secret fields PayHere's checkout form also requires, sourced
     * from the order's own snapshot — never re-entered by the client.
     *
     * @return array{merchant_id: string, order_id: string, amount: string, currency: string, hash: string, checkout_url: string, items: string, return_url: string, cancel_url: string, notify_url: string, first_name: string, last_name: string, email: string, phone: string, address: string, city: string, country: string}
     */
    public function buildInitiatePayload(Order $order): array
    {
        $rate = config('pricing.usd_to_lkr_rate');
        $settlementAmountCents = (int) round($order->total_cents * $rate);

        $order->forceFill([
            'fx_rate' => $rate,
            'settlement_amount' => $settlementAmountCents,
        ])->save();

        $merchantId = config('services.payhere.merchant_id');
        $amount = $this->formatAmount($settlementAmountCents);
        $currency = 'LKR';
        $shipping = $order->shipping_address ?? [];
        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        return [
            'merchant_id' => $merchantId,
            'order_id' => $order->reference,
            'amount' => $amount,
            'currency' => $currency,
            'hash' => $this->initiateHash($merchantId, $order->reference, $amount, $currency),
            'checkout_url' => config('services.payhere.sandbox')
                ? 'https://sandbox.payhere.lk/pay/checkout'
                : 'https://www.payhere.lk/pay/checkout',
            'items' => "Ceylon Spicera order {$order->reference}",
            'return_url' => "{$frontendUrl}/checkout?reference={$order->reference}",
            'cancel_url' => "{$frontendUrl}/checkout?reference={$order->reference}&cancelled=1",
            'notify_url' => config('services.payhere.notify_url'),
            'first_name' => $shipping['first_name'] ?? '',
            'last_name' => $shipping['last_name'] ?? '',
            'email' => $order->email,
            'phone' => $order->phone ?? '',
            'address' => $shipping['street'] ?? '',
            'city' => $shipping['city'] ?? '',
            'country' => $shipping['country'] ?? '',
        ];
    }

    /**
     * The PayHere checkout hash: merchant_id + order_id + amount + currency
     * + uppercase md5(merchant_secret), all md5'd and uppercased.
     */
    public function initiateHash(string $merchantId, string $orderId, string $amount, string $currency): string
    {
        return strtoupper(md5(
            $merchantId.
            $orderId.
            $amount.
            $currency.
            $this->secretHash()
        ));
    }

    /**
     * Verify a notify webhook's md5sig against the locally recomputed
     * signature: merchant_id + order_id + payhere_amount + payhere_currency
     * + status_code + uppercase md5(merchant_secret).
     */
    public function verifyNotifySignature(array $payload): bool
    {
        $local = strtoupper(md5(
            ($payload['merchant_id'] ?? '').
            ($payload['order_id'] ?? '').
            ($payload['payhere_amount'] ?? '').
            ($payload['payhere_currency'] ?? '').
            ($payload['status_code'] ?? '').
            $this->secretHash()
        ));

        return hash_equals($local, strtoupper((string) ($payload['md5sig'] ?? '')));
    }

    /**
     * Format an integer cents amount the way PayHere expects: 2 decimals,
     * no thousands separator, e.g. 543000 -> "5430.00".
     */
    public function formatAmount(int $cents): string
    {
        return number_format($cents / 100, 2, '.', '');
    }

    private function secretHash(): string
    {
        return strtoupper(md5((string) config('services.payhere.merchant_secret')));
    }
}
