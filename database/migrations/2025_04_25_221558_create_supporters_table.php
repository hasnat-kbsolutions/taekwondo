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
        Schema::create('supporters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('club_id');
            $table->string('country')->nullable();
            $table->unsignedBigInteger('organization_id');
            $table->string('name');
            $table->string('surename');
            $table->string('gender');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('type'); // e.g. "technical", "admin", etc.
            $table->boolean('status')->default(0); // You can change to tinyInteger if needed
            $table->string('profile_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supporters');
    }
};
