<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use App\Http\Controllers\GradeHistoryController;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GradeReportController extends Controller
{
    /**
     * Display grade progression report for club students
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;

        // Get all students in the club with their grade history
        $students = Student::where('club_id', $clubId)
            ->with(['club', 'gradeHistories' => function ($query) {
                $query->orderBy('achieved_at', 'desc');
            }])
            ->latest()
            ->get()
            ->map(function ($student) {
                $gradeHistory = $student->gradeHistories;
                $stats = GradeHistoryController::getGradeStats($student);

                return [
                    'id' => $student->id,
                    'name' => $student->name . ' ' . ($student->surname ?? ''),
                    'code' => $student->code,
                    'club' => $student->club?->name,
                    'current_grade' => $student->grade,
                    'grades_achieved' => $stats['total_grades_achieved'],
                    'started_date' => $stats['first_grade_date']?->format('M d, Y'),
                    'latest_achievement' => $stats['latest_grade_date']?->format('M d, Y'),
                    'total_days_progressing' => $stats['total_progression_days'],
                    'history_count' => $gradeHistory->count(),
                ];
            });

        return Inertia::render('Club/GradeReport/Index', [
            'students' => $students,
        ]);
    }

    /**
     * Show detailed grade progression for a specific student
     */
    public function show(Student $student)
    {
        // Verify student belongs to club
        $user = Auth::user();
        if ($student->club_id !== $user->userable_id) {
            abort(403, 'Unauthorized');
        }

        $gradeHistory = $student->gradeHistories()
            ->orderBy('achieved_at', 'desc')
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'grade_name' => $history->grade_name,
                    'achieved_at' => $history->achieved_at->format('Y-m-d'),
                    'achieved_at_formatted' => $history->achieved_at->format('M d, Y'),
                    'duration_days' => $history->duration_days,
                    'duration_formatted' => $this->formatDuration($history->duration_days),
                    'notes' => $history->notes,
                ];
            });

        $stats = GradeHistoryController::getGradeStats($student);

        return Inertia::render('Club/GradeReport/Show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name . ' ' . ($student->surname ?? ''),
                'code' => $student->code,
                'grade' => $student->grade,
                'profile_image' => $student->profile_image,
            ],
            'gradeHistory' => $gradeHistory,
            'stats' => $stats,
        ]);
    }

    /**
     * Format duration in days to human-readable format
     */
    private function formatDuration($days)
    {
        if (!$days) {
            return 'Current';
        }

        $years = intdiv($days, 365);
        $months = intdiv(($days % 365), 30);
        $remainingDays = $days % 30;

        $parts = [];
        if ($years > 0) $parts[] = "$years year" . ($years > 1 ? 's' : '');
        if ($months > 0) $parts[] = "$months month" . ($months > 1 ? 's' : '');
        if ($remainingDays > 0 || empty($parts)) $parts[] = "$remainingDays day" . ($remainingDays > 1 ? 's' : '');

        return implode(', ', array_slice($parts, 0, 2));
    }
}
