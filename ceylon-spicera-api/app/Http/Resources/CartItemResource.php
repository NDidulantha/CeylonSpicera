<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
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
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'slug' => $this->product->slug,
                'badge' => $this->product->badge,
                'stock_status' => $this->product->stock_status,
            ],
            'size' => [
                'id' => $this->productSize->id,
                'size_key' => $this->productSize->size_key,
                'label' => $this->productSize->label,
                'price_cents' => $this->productSize->price_cents,
            ],
            'quantity' => $this->quantity,
            'line_total_cents' => $this->productSize->price_cents * $this->quantity,
        ];
    }
}
