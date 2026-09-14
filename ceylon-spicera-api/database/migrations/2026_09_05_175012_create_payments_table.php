<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained();
            $table->string('gateway');
            $table->string('gateway_payment_id')->nullable()->index();
            $table->enum('status', ['pending', 'success', 'failed', 'chargeback', 'refunded']);
            $table->unsignedBigInteger('amount');
            $table->char('currency', 3);
            $table->string('method')->nullable();
            $table->char('card_last4', 4)->nullable();
            $table->json('raw_payload');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
