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
        Schema::create('students', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('club_id');
            $table->unsignedBigInteger('organization_id');

            $table->string('uid')->unique();
            $table->string('code');
            $table->string('name');
            $table->string('surname')->nullable();
            $table->string('nationality');
            $table->date('dob');
            $table->date('dod')->nullable();
            $table->string('grade');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('id_passport')->nullable();

            $table->string('profile_image')->nullable();
            $table->string('identification_document')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('street')->nullable();
            $table->string('country')->nullable();

            $table->boolean('status')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
