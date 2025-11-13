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
            $table->foreignId('student_fee_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('method'); // cash, card, stripe, etc.
            $table->enum('status', ['pending', 'successful', 'failed'])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->date('pay_at')->nullable();
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
