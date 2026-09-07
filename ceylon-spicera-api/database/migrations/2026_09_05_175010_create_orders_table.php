<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('reference')->unique();
            $table->enum('status', ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])->default('pending');

            // Money — all cents, all server-computed
            $table->unsignedInteger('subtotal_cents');
            $table->unsignedInteger('discount_cents')->default(0);
            $table->unsignedInteger('shipping_cents')->default(0);
            $table->unsignedInteger('gift_wrap_cents')->default(0);
            $table->unsignedInteger('duty_cents')->default(0);
            $table->unsignedInteger('total_cents');
            $table->char('currency', 3)->default('USD');

            // Settlement
            $table->char('settlement_currency', 3)->default('LKR');
            $table->unsignedBigInteger('settlement_amount')->nullable();
            $table->decimal('fx_rate', 12, 6)->nullable();

            // Details
            $table->foreignId('promo_code_id')->nullable()->constrained();
            $table->string('shipping_rate_key');
            $table->boolean('gift_wrap')->default(false);
            $table->text('gift_message')->nullable();
            $table->text('customer_notes')->nullable();
            $table->json('shipping_address');
            $table->json('billing_address');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->timestamp('placed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
