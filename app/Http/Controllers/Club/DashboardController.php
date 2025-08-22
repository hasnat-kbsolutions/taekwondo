<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Student;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Instructor;
use App\Models\Rating;
use App\Models\Attendance;
use App\Models\Certification;

use App\Models\Supporter;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function index()
    {
        $club = Auth::user()->userable;

        // Get student IDs in this club
        $studentIds = $club->students()->pluck('id');
        $instructorIds = $club->instructors()->pluck('id');

        // Fetch payments for these students
        $payments = Payment::whereIn('student_id', $studentIds)->get();

        // Get rating statistics
        $studentRatings = Rating::whereIn('rated_id', $studentIds)
            ->where('rated_type', 'App\Models\Student');

        $instructorRatings = Rating::whereIn('rated_id', $instructorIds)
            ->where('rated_type', 'App\Models\Instructor');

        $avgStudentRating = $studentRatings->count() > 0 ? $studentRatings->avg('rating') : 0;
        $avgInstructorRating = $instructorRatings->count() > 0 ? $instructorRatings->avg('rating') : 0;
        $totalRatings = $studentRatings->count() + $instructorRatings->count();

        // Get attendance statistics for current month
        $currentMonth = now()->startOfMonth();
        $attendances = \App\Models\Attendance::whereIn('student_id', $studentIds)
            ->whereMonth('date', $currentMonth->month)
            ->whereYear('date', $currentMonth->year)
            ->get();

        $totalAttendanceDays = $attendances->count();
        $presentDays = $attendances->where('status', 'present')->count();
        $absentDays = $attendances->where('status', 'absent')->count();
        $attendanceRate = $totalAttendanceDays > 0 ? round(($presentDays / $totalAttendanceDays) * 100, 1) : 0;

        // Get certification statistics
        $certificationsCount = \App\Models\Certification::whereIn('student_id', $studentIds)->count();

        return Inertia::render('Club/Dashboard', [
            'studentsCount' => $club->students()->count(),
            'instructorsCount' => $club->instructors()->count(),
            'paymentsCount' => $payments->count(),
            'totalAmount' => $payments->sum('amount'),
            'paidCount' => $payments->where('status', 'paid')->count(),
            'pendingCount' => $payments->where('status', 'pending')->count(),
            'recentPayments' => $payments->sortByDesc('pay_at')->take(5)->values(),
            'avgStudentRating' => round($avgStudentRating, 1),
            'avgInstructorRating' => round($avgInstructorRating, 1),
            'totalRatings' => $totalRatings,
            'totalAttendanceDays' => $totalAttendanceDays,
            'presentDays' => $presentDays,
            'absentDays' => $absentDays,
            'attendanceRate' => $attendanceRate,
            'certificationsCount' => $certificationsCount,
        ]);
    }
}
