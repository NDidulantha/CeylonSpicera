<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurrencyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'symbol' => $this->symbol,
            'rate_to_usd' => (float) $this->rate_to_usd,
            'updated_at' => $this->updated_at,
        ];
    }
}
