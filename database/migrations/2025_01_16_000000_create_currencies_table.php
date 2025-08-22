<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create currencies table
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3)->unique(); // ISO 4217 code (MYR, USD, EUR, etc.)
            $table->string('name'); // Malaysian Ringgit, US Dollar, Euro, etc.
            $table->string('symbol'); // RM, $, €, etc.
            $table->integer('decimal_places')->default(2);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop currencies table
        Schema::dropIfExists('currencies');
    }
};
