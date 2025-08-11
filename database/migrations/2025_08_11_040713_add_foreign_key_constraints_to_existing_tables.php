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
        // Add foreign key constraints to students table
        Schema::table('students', function (Blueprint $table) {
            $table->foreign('club_id')->references('id')->on('clubs')->onDelete('cascade');
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
        });

        // Add foreign key constraints to clubs table
        Schema::table('clubs', function (Blueprint $table) {
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove foreign key constraints from students table
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['club_id']);
            $table->dropForeign(['organization_id']);
        });

        // Remove foreign key constraints from clubs table
        Schema::table('clubs', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
        });
    }
};
