<?php

namespace Database\Seeders;

use App\Models\Instructor;
use App\Models\Club;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class InstructorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clubs = Club::all();
        $organizations = Organization::all();

        $instructors = [
            [
                'name' => 'Master Lim',
                'ic_number' => '800101-01-1234',
                'email' => 'master.lim@tkd.com',
                'address' => '123 Jalan Bukit Bintang, Kuala Lumpur',
                'mobile' => '+6012-111-2222',
                'grade' => '6th Dan Black Belt',
                'gender' => 'male',
                'profile_picture' => null,
            ],
            [
                'name' => 'Sensei Wong',
                'ic_number' => '850505-05-5678',
                'email' => 'sensei.wong@tkd.com',
                'address' => '456 Jalan Subang, Shah Alam',
                'mobile' => '+6012-333-4444',
                'grade' => '4th Dan Black Belt',
                'gender' => 'male',
                'profile_picture' => null,
            ],
            [
                'name' => 'Coach Tan',
                'ic_number' => '900909-09-9012',
                'email' => 'coach.tan@tkd.com',
                'address' => '789 Jalan Gurney, George Town',
                'mobile' => '+6012-555-6666',
                'grade' => '3rd Dan Black Belt',
                'gender' => 'female',
                'profile_picture' => null,
            ],
        ];

        foreach ($instructors as $index => $instructor) {
            $instructor['club_id'] = $clubs[$index % $clubs->count()]->id;
            $instructor['organization_id'] = $organizations[$index % $organizations->count()]->id;
            Instructor::create($instructor);
        }
    }
}