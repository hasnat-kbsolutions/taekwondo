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
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('method'); // e.g., cash, stripe
            $table->string('status'); // e.g., pending, paid
            $table->string('payment_month'); // YYYY-MM
            $table->date('pay_at')->nullable();
            $table->text('notes')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('currency_code', 3)->default('MYR');

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
