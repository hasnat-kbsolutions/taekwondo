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
            OrganizationSeeder::class,
            ClubSeeder::class,
            StudentSeeder::class,
            InstructorSeeder::class,
            UserSeeder::class,
            CertificationSeeder::class,
            AttendanceSeeder::class,
            PaymentSeeder::class,
            RatingSeeder::class,
        ]);
    }
}
