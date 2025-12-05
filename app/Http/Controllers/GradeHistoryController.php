<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentGradeHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GradeHistoryController extends Controller
{
    /**
     * Record a grade change for a student
     */
    public static function recordGradeChange(Student $student, string $newGrade, ?string $notes = null, ?string $oldGrade = null): StudentGradeHistory
    {
        // Get the previous grade from the latest history entry
        $previousHistory = $student->gradeHistories()->first();

        // Determine what the previous grade was
        if ($oldGrade !== null) {
            // Use the provided old grade
            $previousGrade = $oldGrade;
        } elseif ($previousHistory) {
            // Use the grade from the latest history entry
            $previousGrade = $previousHistory->grade_name;
        } else {
            // No history exists, so we'll allow recording even if it's the same as current grade
            // (this handles the case when we want to record the initial grade)
            $previousGrade = null;
        }

        // Only record if the grade actually changed
        if ($previousGrade !== null && $previousGrade === $newGrade) {
            return $previousHistory ?? new StudentGradeHistory();
        }

        // Update duration_days for the previous history record
        if ($previousHistory) {
            $daysDuration = $previousHistory->achieved_at->diffInDays(now());
            $previousHistory->update(['duration_days' => $daysDuration]);
        }

        // Create new history record
        $history = StudentGradeHistory::create([
            'student_id' => $student->id,
            'grade_name' => $newGrade,
            'achieved_at' => now()->toDateString(),
            'notes' => $notes,
        ]);

        return $history;
    }

    /**
     * Get grade progression timeline for a student
     */
    public static function getGradeTimeline(Student $student)
    {
        return $student->gradeHistories()
            ->orderBy('achieved_at', 'desc')
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'grade_name' => $history->grade_name,
                    'achieved_at' => $history->achieved_at->format('Y-m-d'),
                    'achieved_at_formatted' => $history->achieved_at->format('M d, Y'),
                    'duration_days' => $history->duration_days,
                    'duration_formatted' => $history->duration_days ? $this->formatDaysDuration($history->duration_days) : 'Current',
                    'notes' => $history->notes,
                ];
            });
    }

    /**
     * Get grade statistics for a student
     */
    public static function getGradeStats(Student $student)
    {
        $histories = $student->gradeHistories()->orderBy('achieved_at', 'asc')->get();

        // Get the first (oldest) grade entry
        $firstHistory = $histories->first();

        // Calculate total days since first grade
        $totalDays = $firstHistory ? (int) $firstHistory->achieved_at->diffInDays(now()) : 0;

        // Calculate average days per grade (only count grades with duration_days set)
        $gradesWithDuration = $histories->filter(fn($h) => $h->duration_days !== null);
        $averageDays = $gradesWithDuration->count() > 0
            ? (int) round($gradesWithDuration->sum('duration_days') / $gradesWithDuration->count())
            : 0;

        return [
            'total_grades_achieved' => $histories->count(),
            'current_grade' => $student->grade,
            'first_grade_date' => $firstHistory?->achieved_at,
            'latest_grade_date' => $histories->last()?->achieved_at,
            'total_progression_days' => $totalDays,
            'average_days_per_grade' => $averageDays,
        ];
    }

    /**
     * Format days duration to human-readable format
     */
    private static function formatDaysDuration($days): string
    {
        if (!$days) {
            return 'N/A';
        }

        $years = intdiv($days, 365);
        $months = intdiv(($days % 365), 30);
        $remainingDays = $days % 30;

        $parts = [];
        if ($years > 0) $parts[] = "$years year" . ($years > 1 ? 's' : '');
        if ($months > 0) $parts[] = "$months month" . ($months > 1 ? 's' : '');
        if ($remainingDays > 0 || empty($parts)) $parts[] = "$remainingDays day" . ($remainingDays > 1 ? 's' : '');

        return implode(', ', array_slice($parts, 0, 2)); // Show max 2 units
    }
}
