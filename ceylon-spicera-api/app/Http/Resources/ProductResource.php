<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            'base_price_cents' => $this->base_price_cents,
            'short_description' => $this->short_description,
            'long_description' => $this->long_description,
            'badge' => $this->badge,
            'stock_status' => $this->stock_status,
            'stock_quantity' => $this->stock_quantity,
            'estate' => $this->estate,
            'harvest_month' => $this->harvest_month,
            'lot_number' => $this->lot_number,
            'rating' => (float) $this->rating,
            'review_count' => $this->review_count,
            'is_featured' => $this->is_featured,
            'sizes' => ProductSizeResource::collection($this->whenLoaded('sizes')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
