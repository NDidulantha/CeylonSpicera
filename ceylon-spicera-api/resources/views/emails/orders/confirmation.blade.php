<x-mail::message>
# Thank you for your order

Your order **{{ $order->reference }}** has been confirmed and is being prepared.

<x-mail::table>
| Item | Size | Qty | Total |
| :--- | :--- | :-- | ----: |
@foreach ($order->items as $item)
| {{ $item->product_name }} | {{ $item->size_label }} | {{ $item->quantity }} | ${{ number_format($item->line_total_cents / 100, 2) }} |
@endforeach
</x-mail::table>

Subtotal: ${{ number_format($order->subtotal_cents / 100, 2) }}
@if ($order->discount_cents > 0)
Discount: -${{ number_format($order->discount_cents / 100, 2) }}
@endif
Shipping: ${{ number_format($order->shipping_cents / 100, 2) }}
@if ($order->gift_wrap_cents > 0)
Gift wrap: ${{ number_format($order->gift_wrap_cents / 100, 2) }}
@endif
@if ($order->duty_cents > 0)
Import duty: ${{ number_format($order->duty_cents / 100, 2) }}
@endif

**Total: ${{ number_format($order->total_cents / 100, 2) }}**

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
