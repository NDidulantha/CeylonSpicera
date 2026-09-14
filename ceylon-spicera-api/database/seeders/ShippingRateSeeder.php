<?php

namespace Database\Seeders;

use App\Models\ShippingRate;
use Illuminate\Database\Seeder;

class ShippingRateSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        ShippingRate::create([
            'key' => 'standard',
            'name' => 'Standard export',
            'eta' => '8-12 working days · tracked',
            'price_cents' => 950,
            'free_above_cents' => 7500,
            'is_active' => true,
        ]);

        ShippingRate::create([
            'key' => 'express',
            'name' => 'Express air',
            'eta' => '3-5 working days · tracked',
            'price_cents' => 2400,
            'free_above_cents' => null,
            'is_active' => true,
        ]);
    }
}
