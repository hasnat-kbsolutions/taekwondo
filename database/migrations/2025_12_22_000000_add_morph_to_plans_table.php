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
        Schema::table('plans', function (Blueprint $table) {
            // Remove unique constraint on name (will be unique per club instead)
            $table->dropUnique(['name']);

            // Add morph columns for club association
            $table->string('planable_type')->nullable()->after('id');
            $table->unsignedBigInteger('planable_id')->nullable()->after('planable_type');

            // Add index for morph relationship
            $table->index(['planable_type', 'planable_id']);

            // Add unique constraint on name per club
            $table->unique(['name', 'planable_type', 'planable_id'], 'plans_name_planable_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            // Remove morph columns and indexes
            $table->dropUnique('plans_name_planable_unique');
            $table->dropIndex(['planable_type', 'planable_id']);
            $table->dropColumn(['planable_type', 'planable_id']);

            // Restore unique constraint on name
            $table->unique('name');
        });
    }
};

