<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $items = $this->items;

        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($items),
            'item_count' => $items->sum('quantity'),
            'subtotal_cents' => $items->sum(fn ($item) => $item->productSize->price_cents * $item->quantity),
        ];
    }
}
