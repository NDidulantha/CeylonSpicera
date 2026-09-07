<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['shipping', 'billing']);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('company')->nullable();
            $table->string('country');
            $table->string('street');
            $table->string('apartment')->nullable();
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('postcode');
            $table->string('phone')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
