<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = ['Cinnamon', 'Pepper', 'Cardamom', 'Roots & Leaf', 'Blends', 'Gift Sets'];

        foreach ($categories as $index => $name) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'sort_order' => $index,
            ]);
        }
    }
}
