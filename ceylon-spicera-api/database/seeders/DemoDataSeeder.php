<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Not part of the standard seed chain — run explicitly with
 * `php artisan db:seed --class=DemoDataSeeder` to populate sample
 * orders/reviews/messages for exercising the admin panel locally.
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first() ?? User::factory()->create();

        Order::factory()->for($user)->create(['status' => 'paid', 'paid_at' => now(), 'placed_at' => now()]);
        Order::factory()->for($user)->create(['status' => 'pending']);

        $product = Product::first();
        Review::factory()->create(['product_id' => $product->id, 'user_id' => $user->id, 'is_approved' => false]);
        Review::factory()->create(['product_id' => $product->id, 'is_approved' => true]);

        ContactMessage::factory()->create();
        NewsletterSubscriber::factory()->create();
    }
}
