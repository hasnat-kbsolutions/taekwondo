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
        // Drop existing tables if they exist
        Schema::dropIfExists('student_grade_histories');
        Schema::dropIfExists('grade_levels');

        // Create grade_levels table
        Schema::create('grade_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique(); // e.g., "10th Gup - White"
            $table->string('color', 7)->nullable(); // Hex color code e.g., "#FFFFFF"
            $table->integer('order')->default(0); // For ordering grades
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Create student_grade_histories table
        Schema::create('student_grade_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('grade_name'); // The grade achieved (e.g., "10th Gup - White")
            $table->date('achieved_at'); // When the grade was achieved
            $table->integer('duration_days')->nullable(); // Days at this grade level
            $table->text('notes')->nullable(); // Any notes about the grade change
            $table->timestamps();

            // Index for faster lookups
            $table->index('student_id');
            $table->index('achieved_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_grade_histories');
        Schema::dropIfExists('grade_levels');
    }
};
