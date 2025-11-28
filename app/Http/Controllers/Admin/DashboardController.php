<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Student;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Supporter;
use App\Models\Instructor;
use App\Models\Rating;
use App\Models\Attendance;
use App\Models\Certification;

class DashboardController extends Controller
{
    public function index()
    {
        // Get rating statistics
        $studentRatings = Rating::where('rated_type', 'App\Models\Student');
        $instructorRatings = Rating::where('rated_type', 'App\Models\Instructor');

        $avgStudentRating = $studentRatings->count() > 0 ? $studentRatings->avg('rating') : 0;
        $avgInstructorRating = $instructorRatings->count() > 0 ? $instructorRatings->avg('rating') : 0;
        $totalRatings = $studentRatings->count() + $instructorRatings->count();

        // Get attendance statistics for current month
        $currentMonth = now()->startOfMonth();
        $attendances = \App\Models\Attendance::whereMonth('date', $currentMonth->month)
            ->whereYear('date', $currentMonth->year)
            ->get();

        $totalAttendanceDays = $attendances->count();
        $presentDays = $attendances->where('status', 'present')->count();
        $absentDays = $attendances->where('status', 'absent')->count();
        $attendanceRate = $totalAttendanceDays > 0 ? round(($presentDays / $totalAttendanceDays) * 100, 1) : 0;

        // Get certification statistics
        $certificationsCount = \App\Models\Certification::count();

        return Inertia::render('Admin/dashboard', [
            'studentsCount' => Student::count(),
            'organizationsCount' => Organization::count(),
            'clubsCount' => Club::count(),
            'SupportersCount' => Supporter::count(),
            'instructorsCount' => Instructor::count(),
            'totalAttendanceDays' => $totalAttendanceDays,
            'presentDays' => $presentDays,
            'absentDays' => $absentDays,
            'attendanceRate' => $attendanceRate,
            'certificationsCount' => $certificationsCount,
            'avgStudentRating' => round($avgStudentRating, 1),
            'avgInstructorRating' => round($avgInstructorRating, 1),
            'totalRatings' => $totalRatings,
        ]);
    }
}
