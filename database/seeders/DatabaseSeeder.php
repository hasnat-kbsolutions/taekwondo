<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CurrencySeeder::class, // Must be first as other models depend on currencies
            ComprehensiveDummyDataSeeder::class, // Comprehensive dummy data seeder with 150+ students
        ]);
    }
}
