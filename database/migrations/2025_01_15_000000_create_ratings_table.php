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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rater_id'); // Who is giving the rating (student or teacher)
            $table->string('rater_type'); // 'student' or 'teacher'
            $table->unsignedBigInteger('rated_id'); // Who is being rated (student or teacher)
            $table->string('rated_type'); // 'student' or 'teacher'
            $table->integer('rating'); // 1-5 stars
            $table->text('comment')->nullable(); // Optional comment
            $table->timestamps();

            // Indexes for better performance
            $table->index(['rater_id', 'rater_type']);
            $table->index(['rated_id', 'rated_type']);
            $table->index(['rater_id', 'rater_type', 'rated_id', 'rated_type']);

            // Ensure rating is between 1-5 (will be handled in model validation)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};