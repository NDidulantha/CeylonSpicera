<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Seed display-only FX estimates against the USD base.
     */
    public function run(): void
    {
        $rates = [
            ['code' => 'USD', 'symbol' => '$', 'rate_to_usd' => 1],
            ['code' => 'LKR', 'symbol' => 'Rs', 'rate_to_usd' => 300],
            ['code' => 'GBP', 'symbol' => '£', 'rate_to_usd' => 0.78],
            ['code' => 'EUR', 'symbol' => '€', 'rate_to_usd' => 0.92],
            ['code' => 'AUD', 'symbol' => 'A$', 'rate_to_usd' => 1.52],
            ['code' => 'CAD', 'symbol' => 'C$', 'rate_to_usd' => 1.37],
        ];

        foreach ($rates as $rate) {
            Currency::query()->updateOrCreate(['code' => $rate['code']], $rate);
        }
    }
}
