<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'size_label' => $this->size_label,
            'lot_number' => $this->lot_number,
            'unit_price_cents' => $this->unit_price_cents,
            'quantity' => $this->quantity,
            'line_total_cents' => $this->line_total_cents,
        ];
    }
}
