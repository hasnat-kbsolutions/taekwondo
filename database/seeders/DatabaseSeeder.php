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
            OrganizationSeeder::class,
            ClubSeeder::class,
            StudentSeeder::class,
            PlanSeeder::class,
            InstructorSeeder::class,
            UserSeeder::class,
            CertificationSeeder::class,
            AttendanceSeeder::class,
            // PaymentSeeder::class,
            RatingSeeder::class,
        ]);
    }
}
