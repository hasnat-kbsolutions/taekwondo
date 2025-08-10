<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Student;
use App\Models\Instructor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@tkd.com',
            'password' => Hash::make('mtf'),
            'role' => 'admin',
            'userable_type' => null,
            'userable_id' => null,
        ]);

        // Create organization users
        $organizations = Organization::all();
        foreach ($organizations as $organization) {
            User::create([
                'name' => $organization->name . ' Admin',
                'email' => 'org.' . strtolower(str_replace(' ', '', $organization->name)) . '@tkd.com',
                'password' => Hash::make('mtf'),
                'role' => 'organization',
                'userable_type' => Organization::class,
                'userable_id' => $organization->id,
            ]);
        }

        // Create club users
        $clubs = Club::all();
        foreach ($clubs as $club) {
            User::create([
                'name' => $club->name . ' Manager',
                'email' => 'club.' . strtolower(str_replace(' ', '', $club->name)) . '@tkd.com',
                'password' => Hash::make('mtf'),
                'role' => 'club',
                'userable_type' => Club::class,
                'userable_id' => $club->id,
            ]);
        }

        // Create student users
        $students = Student::all();
        foreach ($students as $index => $student) {
            User::create([
                'name' => $student->name . ' ' . $student->surname,
                'email' => 'student' . ($index + 1) . '@tkd.com',
                'password' => Hash::make('mtf'),
                'role' => 'student',
                'userable_type' => Student::class,
                'userable_id' => $student->id,
            ]);
        }

        // Create instructor users
        $instructors = Instructor::all();
        foreach ($instructors as $index => $instructor) {
            User::create([
                'name' => $instructor->name,
                'email' => 'instructor' . ($index + 1) . '@tkd.com',
                'password' => Hash::make('mtf'),
                'role' => 'instructor',
                'userable_type' => Instructor::class,
                'userable_id' => $instructor->id,
            ]);
        }
    }
}
