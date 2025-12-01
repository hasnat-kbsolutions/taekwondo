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
        Schema::table('plans', function (Blueprint $table) {
            $table->string('interval')->nullable()->after('description');
            $table->integer('interval_count')->nullable()->after('interval');
            $table->string('discount_type')->nullable()->after('interval_count');
            $table->decimal('discount_value', 10, 2)->nullable()->after('discount_type');
            $table->date('effective_from')->nullable()->after('discount_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['interval', 'interval_count', 'discount_type', 'discount_value', 'effective_from']);
        });
    }
};
