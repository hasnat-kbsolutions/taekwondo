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
        Schema::create('student_fee_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade')->unique();
            $table->foreignId('plan_id')->nullable()->constrained('plans')->nullOnDelete();
            $table->decimal('custom_amount', 10, 2)->nullable();
            $table->string('currency_code', 3)->nullable(); // fallback to plan currency if null

            // Interval (chosen by student)
            $table->enum('interval', ['monthly', 'quarterly', 'semester', 'yearly', 'custom'])->default('monthly');
            $table->unsignedInteger('interval_count')->nullable(); // required when interval = custom

            // Discount (independent from interval)
            $table->enum('discount_type', ['percent', 'fixed'])->nullable();
            $table->decimal('discount_value', 10, 2)->default(0);

            $table->date('effective_from')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            // Optional scheduling helpers (not required to use)
            $table->date('next_period_start')->nullable();
            $table->date('next_due_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_fee_plans');
    }
};


