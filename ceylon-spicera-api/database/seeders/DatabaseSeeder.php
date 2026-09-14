<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            PromoCodeSeeder::class,
            ShippingRateSeeder::class,
            CurrencySeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->admin()->create([
            'name' => 'Ceylon Spicera Admin',
            'email' => 'admin@ceylonspicera.com',
            'password' => 'password',
        ]);
    }
}
