<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
        
            // Identity
            $table->string('name');
            $table->string('code')->nullable(); // e.g., unique org code (ORG001)
            $table->string('logo')->nullable();
        
            // Contact Info
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
        
            // Address Info
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('street')->nullable();
            $table->string('postal_code')->nullable();
        
            // Flags
            $table->boolean('status')->default(true); // Active/Inactive
            $table->boolean('is_verified')->default(false); // Verified organization
        
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
