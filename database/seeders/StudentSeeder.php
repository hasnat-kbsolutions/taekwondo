<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Club;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clubs = Club::all();
        $organizations = Organization::all();

        // Check if we have clubs and organizations
        if ($clubs->count() === 0 || $organizations->count() === 0) {
            $this->command->info('Skipping StudentSeeder: No clubs or organizations found.');
            return;
        }

        $students = [
            [
                'uid' => 'STU001',
                'code' => 'S001',
                'name' => 'Ahmad',
                'surname' => 'Hassan',
                'nationality' => 'Malaysian',
                'dob' => '2005-03-15',
                'dod' => null,
                'grade' => 'Red Belt',
                'gender' => 'Male',
                'id_passport' => 'A12345678',
                'profile_image' => null,
                'identification_document' => null,
                'email' => 'ahmad.hassan@email.com',
                'phone' => '+6012-345-6789',
                'website' => null,
                'city' => 'Kuala Lumpur',
                'postal_code' => '55100',
                'street' => '123 Jalan Bukit Bintang',
                'country' => 'Malaysia',
                'status' => true,
            ],
            [
                'uid' => 'STU002',
                'code' => 'S002',
                'name' => 'Siti',
                'surname' => 'Aminah',
                'nationality' => 'Malaysian',
                'dob' => '2006-07-22',
                'dod' => null,
                'grade' => 'Blue Belt',
                'gender' => 'Female',
                'id_passport' => 'B87654321',
                'profile_image' => null,
                'identification_document' => null,
                'email' => 'siti.aminah@email.com',
                'phone' => '+6012-987-6543',
                'website' => null,
                'city' => 'Shah Alam',
                'postal_code' => '40100',
                'street' => '456 Jalan Subang',
                'country' => 'Malaysia',
                'status' => true,
            ],
            [
                'uid' => 'STU003',
                'code' => 'S003',
                'name' => 'Raj',
                'surname' => 'Kumar',
                'nationality' => 'Malaysian',
                'dob' => '2004-11-08',
                'dod' => null,
                'grade' => 'Black Belt 1st Dan',
                'gender' => 'Male',
                'id_passport' => 'C11223344',
                'profile_image' => null,
                'identification_document' => null,
                'email' => 'raj.kumar@email.com',
                'phone' => '+6012-555-1234',
                'website' => null,
                'city' => 'George Town',
                'postal_code' => '10250',
                'street' => '789 Jalan Gurney',
                'country' => 'Malaysia',
                'status' => true,
            ],
        ];

        $createdCount = 0;
        foreach ($students as $index => $studentData) {
            // Check if student already exists
            $existingStudent = Student::where('uid', $studentData['uid'])->first();

            if ($existingStudent) {
                $this->command->info("Student with UID {$studentData['uid']} already exists, skipping...");
                continue;
            }

            // Add club and organization IDs
            $studentData['club_id'] = $clubs[$index % $clubs->count()]->id;
            $studentData['organization_id'] = $organizations[$index % $organizations->count()]->id;

            Student::create($studentData);
            $createdCount++;
        }

        $this->command->info("Created {$createdCount} new students successfully.");
    }
}
