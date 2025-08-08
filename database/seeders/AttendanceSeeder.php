<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();

        // Check if we have students
        if ($students->count() === 0) {
            $this->command->info('Skipping AttendanceSeeder: No students found.');
            return;
        }

        $attendances = [
            [
                'student_id' => $students->first()->id,
                'date' => '2024-01-15',
                'status' => 'present',
                'remarks' => 'Regular training session',
            ],
            [
                'student_id' => $students->first()->id,
                'date' => '2024-01-17',
                'status' => 'present',
                'remarks' => 'Belt promotion practice',
            ],
        ];

        // Add more attendance records if we have more students
        if ($students->count() >= 2) {
            $attendances[] = [
                'student_id' => $students->skip(1)->first()->id,
                'date' => '2024-01-15',
                'status' => 'present',
                'remarks' => 'Technique training',
            ];
            $attendances[] = [
                'student_id' => $students->skip(1)->first()->id,
                'date' => '2024-01-17',
                'status' => 'absent',
                'remarks' => 'Sick leave',
            ];
        }

        if ($students->count() >= 3) {
            $attendances[] = [
                'student_id' => $students->skip(2)->first()->id,
                'date' => '2024-01-15',
                'status' => 'present',
                'remarks' => 'Advanced training',
            ];
            $attendances[] = [
                'student_id' => $students->skip(2)->first()->id,
                'date' => '2024-01-17',
                'status' => 'present',
                'remarks' => 'Competition preparation',
            ];
        }

        $createdCount = 0;
        foreach ($attendances as $attendance) {
            Attendance::create($attendance);
            $createdCount++;
        }

        $this->command->info("Created {$createdCount} attendance records successfully.");
    }
}