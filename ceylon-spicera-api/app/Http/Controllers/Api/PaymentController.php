<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\InitiatePaymentRequest;
use App\Http\Requests\Payment\PayHereNotifyRequest;
use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PayHereService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function __construct(private readonly PayHereService $payHere) {}

    /**
     * Build the PayHere checkout payload for one of the user's own pending orders.
     */
    public function initiate(InitiatePaymentRequest $request): JsonResponse
    {
        $order = $request->user()->orders()
            ->where('reference', $request->string('order_reference')->value())
            ->firstOrFail();

        abort_if($order->status !== 'pending', 422, 'This order cannot be paid.');

        return response()->json(['data' => $this->payHere->buildInitiatePayload($order)]);
    }

    /**
     * PayHere's server-to-server payment webhook. Public and CSRF-exempt —
     * authenticity comes from the md5sig check below, never from a session
     * or auth guard. This is the ONLY place an order may be marked paid.
     */
    public function notify(PayHereNotifyRequest $request): Response
    {
        $data = $request->validated();

        if (! $this->payHere->verifyNotifySignature($data)) {
            Log::warning('PayHere webhook signature mismatch', ['order_id' => $data['order_id']]);

            return response('Invalid signature', 400);
        }

        $order = Order::where('reference', $data['order_id'])->first();

        if (! $order) {
            Log::warning('PayHere webhook for unknown order', ['order_id' => $data['order_id']]);

            return response('Unknown order', 404);
        }

        $expectedAmount = $this->payHere->formatAmount((int) $order->settlement_amount);

        if ($data['payhere_amount'] !== $expectedAmount || strcasecmp($data['payhere_currency'], $order->settlement_currency) !== 0) {
            Log::warning('PayHere webhook amount/currency mismatch', ['order_id' => $order->reference]);

            return response('Amount mismatch', 400);
        }

        // Idempotency: PayHere may deliver the same notification more than
        // once. A payment we've already recorded must not be reprocessed.
        if (Payment::where('gateway_payment_id', $data['payment_id'])->exists()) {
            return response('OK', 200);
        }

        $status = match ((int) $data['status_code']) {
            2 => 'success',
            0 => 'pending',
            -1, -2 => 'failed',
            -3 => 'chargeback',
            default => 'failed',
        };

        DB::transaction(function () use ($order, $data, $status) {
            Payment::create([
                'order_id' => $order->id,
                'gateway' => 'payhere',
                'gateway_payment_id' => $data['payment_id'],
                'status' => $status,
                'amount' => (int) round(((float) $data['payhere_amount']) * 100),
                'currency' => strtoupper($data['payhere_currency']),
                'method' => $data['method'] ?? null,
                'card_last4' => isset($data['card_no']) ? substr($data['card_no'], -4) : null,
                'raw_payload' => $data,
            ]);

            if ($status === 'success' && $order->status === 'pending') {
                $this->markPaid($order);
            }
        });

        return response('OK', 200);
    }

    /**
     * Browser return from PayHere's checkout. Display only — never used to
     * mark an order paid. Just sends the shopper back to the front end.
     */
    public function returnRedirect(Request $request): RedirectResponse
    {
        $reference = $request->query('order_id');
        $url = rtrim(config('app.frontend_url'), '/').'/checkout'.($reference ? '?reference='.urlencode($reference) : '');

        return redirect()->away($url);
    }

    /**
     * Apply the effects of a successful payment: mark the order paid,
     * decrement stock, credit promo usage, and queue the confirmation email.
     */
    private function markPaid(Order $order): void
    {
        $order->update(['status' => 'paid', 'paid_at' => now()]);

        foreach ($order->items()->with('product')->get() as $item) {
            if ($item->product) {
                $item->product->update([
                    'stock_quantity' => max(0, $item->product->stock_quantity - $item->quantity),
                ]);
            }
        }

        if ($order->promo_code_id) {
            $order->promoCode?->increment('used_count');
        }

        Mail::to($order->email)->queue(new OrderConfirmationMail($order));
    }
}
