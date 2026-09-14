<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductSizeResource extends JsonResource
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
            'size_key' => $this->size_key,
            'label' => $this->label,
            'multiplier' => (float) $this->multiplier,
            'price_cents' => $this->price_cents,
            'stock_quantity' => $this->stock_quantity,
        ];
    }
}
