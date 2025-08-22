<?php

namespace App\Http\Controllers\Organization;

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
        $organization = Auth::user()->userable;

        // Get all student IDs under this organization
        $studentIds = $organization->students()->pluck('id');
        $instructorIds = $organization->instructors()->pluck('id');

        // Get payment statistics with currency breakdown
        $payments = Payment::whereIn('student_id', $studentIds)->with('currency');

        $paymentsCount = $payments->count();
        $paidCount = Payment::whereIn('student_id', $studentIds)->where('status', 'paid')->count();
        $pendingCount = Payment::whereIn('student_id', $studentIds)->where('status', 'pending')->count();

        // Calculate amounts by currency
        $amountsByCurrency = $payments->get()->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        $defaultCurrencyCode = $organization->default_currency ?? 'MYR';
        $totalAmount = $amountsByCurrency[$defaultCurrencyCode] ?? 0;

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

        return Inertia::render('Organization/Dashboard', [
            'studentsCount' => $organization->students()->count(),
            'clubsCount' => $organization->clubs()->count(),
            'instructorsCount' => $organization->instructors()->count(),
            'paymentsCount' => $paymentsCount,
            'paidCount' => $paidCount,
            'pendingCount' => $pendingCount,
            'totalAmount' => $totalAmount,
            'amountsByCurrency' => $amountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
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
