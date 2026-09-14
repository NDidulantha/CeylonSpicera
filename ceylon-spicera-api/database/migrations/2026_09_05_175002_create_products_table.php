<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->unsignedInteger('base_price_cents');
            $table->string('short_description', 255);
            $table->text('long_description');
            $table->string('badge')->nullable();
            $table->enum('stock_status', ['in', 'low', 'out'])->default('in');
            $table->integer('stock_quantity')->default(0);
            $table->string('estate')->nullable();
            $table->string('harvest_month')->nullable();
            $table->string('lot_number')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('review_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
