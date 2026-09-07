<?php

namespace Database\Seeders;

use App\Models\PromoCode;
use Illuminate\Database\Seeder;

class PromoCodeSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        PromoCode::create([
            'code' => 'HARVEST10',
            'type' => 'percent',
            'value' => 10,
            'is_active' => true,
        ]);

        PromoCode::create([
            'code' => 'MATALE15',
            'type' => 'percent',
            'value' => 15,
            'is_active' => true,
        ]);
    }
}
