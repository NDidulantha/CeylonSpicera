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

        // forceCreate (not factories, which require the dev-only fakerphp/faker
        // package) so this seeder also works in a --no-dev production build.
        User::forceCreate([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'password' => 'password',
            'is_admin' => false,
        ]);

        User::forceCreate([
            'name' => 'Ceylon Spicera Admin',
            'email' => 'admin@ceylonspicera.com',
            'email_verified_at' => now(),
            'password' => 'password',
            'is_admin' => true,
        ]);
    }
}
