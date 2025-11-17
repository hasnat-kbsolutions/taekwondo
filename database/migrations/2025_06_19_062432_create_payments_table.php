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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            // Standalone payments (no student_fee FK)
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('month', 7)->nullable(); // YYYY-MM
            $table->decimal('amount', 10, 2);
            $table->string('method'); // cash, card, stripe, etc.
            $table->enum('status', ['unpaid', 'paid'])->default('unpaid');
            $table->string('transaction_id')->nullable();
            $table->date('pay_at')->nullable();
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('currency_code', 3)->default('MYR');
            $table->json('bank_information')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
