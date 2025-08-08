<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\Student;
use Illuminate\Database\Seeder;

class CertificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();

        $certifications = [
            [
                'student_id' => $students[0]->id,
                'issued_at' => '2024-01-15',
                'notes' => 'Red Belt certification completed successfully',
                'file' => 'certificates/red_belt_cert_001.pdf',
            ],
            [
                'student_id' => $students[1]->id,
                'issued_at' => '2024-02-20',
                'notes' => 'Blue Belt certification with excellent performance',
                'file' => 'certificates/blue_belt_cert_002.pdf',
            ],
            [
                'student_id' => $students[2]->id,
                'issued_at' => '2024-03-10',
                'notes' => 'Black Belt 1st Dan certification - Outstanding achievement',
                'file' => 'certificates/black_belt_1st_dan_003.pdf',
            ],
        ];

        foreach ($certifications as $certification) {
            Certification::create($certification);
        }
    }
} 