<?php

namespace Database\Seeders;

use App\Models\Rating;
use App\Models\Student;
use App\Models\Instructor;
use Illuminate\Database\Seeder;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();
        $instructors = Instructor::all();

        // Check if we have enough data to create ratings
        if ($students->count() === 0 || $instructors->count() === 0) {
            $this->command->info('Skipping RatingSeeder: Not enough students or instructors found.');
            return;
        }

        $ratings = [];

        // Create student ratings for instructors (if we have at least 1 student and 1 instructor)
        if ($students->count() >= 1 && $instructors->count() >= 1) {
            $ratings[] = [
                'rater_id' => $students->first()->id,
                'rater_type' => 'App\Models\Student',
                'rated_id' => $instructors->first()->id,
                'rated_type' => 'App\Models\Instructor',
                'rating' => 5,
                'comment' => 'Excellent teaching methods and very patient with beginners.',
            ];
        }

        // Create more student ratings if we have more students and instructors
        if ($students->count() >= 2 && $instructors->count() >= 2) {
            $ratings[] = [
                'rater_id' => $students->skip(1)->first()->id,
                'rater_type' => 'App\Models\Student',
                'rated_id' => $instructors->skip(1)->first()->id,
                'rated_type' => 'App\Models\Instructor',
                'rating' => 4,
                'comment' => 'Great instructor, helped me improve my techniques significantly.',
            ];
        }

        if ($students->count() >= 3 && $instructors->count() >= 3) {
            $ratings[] = [
                'rater_id' => $students->skip(2)->first()->id,
                'rater_type' => 'App\Models\Student',
                'rated_id' => $instructors->skip(2)->first()->id,
                'rated_type' => 'App\Models\Instructor',
                'rating' => 5,
                'comment' => 'Outstanding mentor, very knowledgeable and supportive.',
            ];
        }

        // Create instructor ratings for students (if we have at least 1 instructor and 1 student)
        if ($instructors->count() >= 1 && $students->count() >= 1) {
            $ratings[] = [
                'rater_id' => $instructors->first()->id,
                'rater_type' => 'App\Models\Instructor',
                'rated_id' => $students->first()->id,
                'rated_type' => 'App\Models\Student',
                'rating' => 4,
                'comment' => 'Dedicated student with good progress in training.',
            ];
        }

        if ($instructors->count() >= 2 && $students->count() >= 2) {
            $ratings[] = [
                'rater_id' => $instructors->skip(1)->first()->id,
                'rater_type' => 'App\Models\Instructor',
                'rated_id' => $students->skip(1)->first()->id,
                'rated_type' => 'App\Models\Student',
                'rating' => 5,
                'comment' => 'Excellent student with strong commitment to learning.',
            ];
        }

        if ($instructors->count() >= 3 && $students->count() >= 3) {
            $ratings[] = [
                'rater_id' => $instructors->skip(2)->first()->id,
                'rater_type' => 'App\Models\Instructor',
                'rated_id' => $students->skip(2)->first()->id,
                'rated_type' => 'App\Models\Student',
                'rating' => 5,
                'comment' => 'Exceptional student, ready for black belt promotion.',
            ];
        }

        // Create the ratings
        foreach ($ratings as $rating) {
            Rating::create($rating);
        }

        $this->command->info('Created ' . count($ratings) . ' ratings successfully.');
    }
}