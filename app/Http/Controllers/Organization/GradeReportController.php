<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Http\Controllers\GradeHistoryController;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GradeReportController extends Controller
{
    /**
     * Display grade progression report for all students
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $organizationId = $user->userable_id;

        // Get all students in the organization with their grade history
        $students = Student::where('organization_id', $organizationId)
            ->whereHas('club', function ($query) use ($organizationId) {
                // Only include students whose clubs belong to THIS organization
                $query->where('organization_id', $organizationId);
            })
            ->with(['organization', 'gradeHistories' => function ($query) {
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
                    'organization' => $student->organization?->name,
                    'current_grade' => $student->grade,
                    'grades_achieved' => $stats['total_grades_achieved'],
                    'started_date' => $stats['first_grade_date']?->format('M d, Y'),
                    'latest_achievement' => $stats['latest_grade_date']?->format('M d, Y'),
                    'total_days_progressing' => $stats['total_progression_days'],
                    'history_count' => $gradeHistory->count(),
                ];
            });

        // Filter by club if provided
        if ($request->filled('club_id')) {
            $students = $students->filter(function ($student) use ($request) {
                return $student['club'] && $student['club'] === Club::find($request->club_id)?->name;
            });
        }

        // Get clubs for filtering
        $clubs = $user->userable->clubs()->select('id', 'name')->get();

        return Inertia::render('Organization/GradeReport/Index', [
            'students' => $students,
            'clubs' => $clubs,
            'selectedClub' => $request->club_id,
        ]);
    }

    /**
     * Show detailed grade progression for a specific student
     */
    public function show(Student $student)
    {
        // Verify student belongs to organization
        $user = Auth::user();
        $organizationId = $user->userable_id;

        if ($student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized');
        }

        // Verify the student's club belongs to this organization
        if ($student->club && $student->club->organization_id !== $organizationId) {
            abort(403, 'This student\'s club does not belong to your organization.');
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

        return Inertia::render('Organization/GradeReport/Show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name . ' ' . ($student->surname ?? ''),
                'code' => $student->code,
                'grade' => $student->grade,
                'club' => $student->club?->name,
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
