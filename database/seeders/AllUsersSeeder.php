<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Instructor;
use App\Models\Student;
use App\Models\Supporter;
use App\Models\Payment;
use App\Models\Attendance;

class AllUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Organization
        $organization = Organization::create([
            'name' => 'Org User Org',
            'email' => 'org@example.com',
            'country' => 'Country',
            'city' => 'City',
            'status' => true,
        ]);
        $orgUser = User::create([
            'name' => $organization->name,
            'email' => $organization->email,
            'password' => Hash::make('password'),
            'role' => 'organization',
            'userable_type' => Organization::class,
            'userable_id' => $organization->id,
        ]);

        // Club (child of organization)
        $clubs = [];
        for ($i = 1; $i <= 3; $i++) {
            $club = Club::create([
                'organization_id' => $organization->id,
                'name' => "Club $i",
                'country' => 'Country',
                'city' => 'City',
                'status' => true,
            ]);
            $clubs[] = $club;
        }
        $clubUser = User::create([
            'name' => $clubs[0]->name,
            'email' => 'club@example.com', // Not stored in club, just for user
            'password' => Hash::make('password'),
            'role' => 'club',
            'userable_type' => Club::class,
            'userable_id' => $clubs[0]->id,
        ]);

        // Instructor (child of club)
        $instructors = [];
        for ($i = 1; $i <= 3; $i++) {
            $inst = Instructor::create([
                'name' => "Instructor $i",
                'email' => "instructor$i@example.com",
                'organization_id' => $organization->id,
                'club_id' => $clubs[0]->id,
            ]);
            $instructors[] = $inst;
        }
        $instructorUser = User::create([
            'name' => $instructors[0]->name,
            'email' => $instructors[0]->email, // instructor has email
            'password' => Hash::make('password'),
            'role' => 'instructor',
            'userable_type' => Instructor::class,
            'userable_id' => $instructors[0]->id,
        ]);

        // Student (child of club)
        $students = [];
        for ($i = 1; $i <= 3; $i++) {
            $student = Student::create([
                'club_id' => $clubs[0]->id,
                'organization_id' => $organization->id,
                'uid' => uniqid('STD-'),
                'code' => uniqid('STD-'),
                'name' => "Student $i",
                'surname' => "Surname $i",
                'nationality' => 'Country',
                'dob' => '2000-01-01',
                'grade' => 'A',
                'gender' => 'male',
                'status' => true,
                'email' => "student$i@example.com",
            ]);
            $students[] = $student;
        }
        $studentUser = User::create([
            'name' => $students[0]->name,
            'email' => $students[0]->email, // student has email
            'password' => Hash::make('password'),
            'role' => 'student',
            'userable_type' => Student::class,
            'userable_id' => $students[0]->id,
        ]);

        // Supporter (child of club)
        $supporters = [];
        for ($i = 1; $i <= 3; $i++) {
            $supporter = Supporter::create([
                'club_id' => $clubs[0]->id,
                'organization_id' => $organization->id,
                'name' => "Supporter $i",
                'surename' => "Surname $i",
                'gender' => 'male',
                'type' => 'technical',
                'status' => true,
            ]);
            $supporters[] = $supporter;
        }
        // Do NOT create a User for supporter (supporter is not a user)

        // Guardian (user only)
        $guardianUser = User::create([
            'name' => 'Guardian User',
            'email' => 'guardian@example.com',
            'password' => Hash::make('password'),
            'role' => 'guardian',
        ]);

        // Payments (child of student)
        foreach ($students as $student) {
            for ($i = 1; $i <= 3; $i++) {
                Payment::create([
                    'student_id' => $student->id,
                    'amount' => 100 * $i,
                    'method' => 'cash',
                    'status' => 'paid',
                    'payment_month' => '2024-01',
                ]);
            }
        }

        // Attendances (child of student)
        foreach ($students as $student) {
            for ($i = 1; $i <= 3; $i++) {
                Attendance::create([
                    'student_id' => $student->id,
                    'date' => now()->subDays($i),
                    'status' => 'present',
                ]);
            }
        }
    }
}