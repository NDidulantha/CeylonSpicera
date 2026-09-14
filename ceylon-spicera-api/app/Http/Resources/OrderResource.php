<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'status' => $this->status,
            'subtotal_cents' => $this->subtotal_cents,
            'discount_cents' => $this->discount_cents,
            'shipping_cents' => $this->shipping_cents,
            'gift_wrap_cents' => $this->gift_wrap_cents,
            'duty_cents' => $this->duty_cents,
            'total_cents' => $this->total_cents,
            'currency' => $this->currency,
            'settlement_currency' => $this->settlement_currency,
            'settlement_amount' => $this->settlement_amount,
            'fx_rate' => $this->fx_rate,
            'shipping_rate_key' => $this->shipping_rate_key,
            'gift_wrap' => $this->gift_wrap,
            'gift_message' => $this->gift_message,
            'customer_notes' => $this->customer_notes,
            'shipping_address' => $this->shipping_address,
            'billing_address' => $this->billing_address,
            'email' => $this->email,
            'phone' => $this->phone,
            'placed_at' => $this->placed_at,
            'paid_at' => $this->paid_at,
            'shipped_at' => $this->shipped_at,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
