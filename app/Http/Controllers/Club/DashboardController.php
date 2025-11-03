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
use App\Models\Currency;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;
use App\Models\PaymentAttachment;
use App\Models\Event;

class DashboardController extends Controller
{
    public function index()
    {
        $club = Auth::user()->userable;

        // Get student IDs in this club
        $studentIds = $club->students()->pluck('id');
        $instructorIds = $club->instructors()->pluck('id');

        // Fetch payments for these students with currency support
        $payments = Payment::whereIn('student_id', $studentIds)->with('currency')->get();

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

        // Get upcoming events
        $upcomingEvents = Event::where('club_id', $club->id)
            ->where('organization_id', $club->organization_id)
            ->where('status', 'upcoming')
            ->where('event_date', '>=', now()->toDateString())
            ->orderBy('event_date', 'asc')
            ->take(3)
            ->get();

        // Get latest 5 payment proofs from today
        $today = now()->toDateString();

        $paymentProofs = PaymentAttachment::whereHas('payment', function ($query) use ($studentIds) {
            $query->whereIn('student_id', $studentIds);
        })
            ->whereDate('created_at', $today)
            ->with(['payment.student', 'payment.currency'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Calculate amounts by currency
        $amountsByCurrency = $payments->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        $defaultCurrencyCode = $club->default_currency ?? 'MYR';
        $totalAmount = $amountsByCurrency[$defaultCurrencyCode] ?? 0;

        return Inertia::render('Club/Dashboard', [
            'studentsCount' => $club->students()->count(),
            'instructorsCount' => $club->instructors()->count(),
            'paymentsCount' => $payments->count(),
            'totalAmount' => $totalAmount,
            'paidCount' => $payments->where('status', 'paid')->count(),
            'pendingCount' => $payments->where('status', 'unpaid')->count(),
            'recentPayments' => $payments->sortByDesc('pay_at')->take(5)->values(),
            'avgStudentRating' => round($avgStudentRating, 1),
            'avgInstructorRating' => round($avgInstructorRating, 1),
            'totalRatings' => $totalRatings,
            'totalAttendanceDays' => $totalAttendanceDays,
            'presentDays' => $presentDays,
            'absentDays' => $absentDays,
            'attendanceRate' => $attendanceRate,
            'certificationsCount' => $certificationsCount,
            'amountsByCurrency' => $amountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
            'upcomingEvents' => $upcomingEvents,
            'paymentProofs' => $paymentProofs,
        ]);
    }
}
