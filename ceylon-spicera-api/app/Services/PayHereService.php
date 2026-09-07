<?php

namespace App\Services;

use App\Models\Order;

class PayHereService
{
    /**
     * Build the PayHere checkout initiate payload for an order, converting
     * its USD total to LKR and persisting the settlement snapshot.
     *
     * @return array{merchant_id: string, order_id: string, amount: string, currency: string, hash: string}
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

        return [
            'merchant_id' => $merchantId,
            'order_id' => $order->reference,
            'amount' => $amount,
            'currency' => $currency,
            'hash' => $this->initiateHash($merchantId, $order->reference, $amount, $currency),
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
