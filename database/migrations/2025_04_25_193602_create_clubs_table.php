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
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->string('name')->nullable(false);
            $table->string('tax_number')->nullable();
            $table->string('invoice_prefix')->nullable(); // if not always needed
            $table->string('logo')->nullable(); // use 'logo' OR 'logo_image'
            $table->string('phone')->nullable();
            $table->boolean('notification_emails')->default(false);
            $table->string('website')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('city')->nullable();
            $table->string('street')->nullable();
            $table->string('country')->nullable();
            $table->boolean('status')->default(false);
            $table->string('default_currency', 3)->default('MYR');

            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clubs');
    }
};
