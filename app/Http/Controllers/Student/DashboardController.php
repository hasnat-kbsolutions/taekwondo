<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Currency;
use App\Models\Event;
use Carbon\Carbon;
use Inertia\Inertia;


class DashboardController extends Controller
{
    // StudentDashboardController.php
    public function index(Request $request)
    {
        $student = Auth::user()->userable;
        $year = $request->input('year', now()->year);

        // Get attendance statistics for the year
        $attendances = $student->attendances()
            ->whereYear('date', $year)
            ->get();

        $totalDays = $attendances->count();
        $presentDays = $attendances->where('status', 'present')->count();
        $absentDays = $attendances->where('status', 'absent')->count();
        $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0;

        // Get payment statistics for the year with currency support
        $payments = $student->payments()
            ->where('payment_month', 'LIKE', $year . '-%')
            ->with('currency')
            ->get();

        $totalPayments = $payments->count();
        $paidPayments = $payments->where('status', 'paid')->count();
        $pendingPayments = $payments->where('status', 'pending')->count();

        // Calculate amounts by currency
        $amountsByCurrency = $payments->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        $paidAmountsByCurrency = $payments->where('status', 'paid')
            ->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        // Get default currency from student's club or organization
        $defaultCurrencyCode = $student->club->default_currency ??
            $student->organization->default_currency ??
            'MYR';

        $totalAmount = $amountsByCurrency[$defaultCurrencyCode] ?? 0;
        $paidAmount = $paidAmountsByCurrency[$defaultCurrencyCode] ?? 0;

        // Get rating statistics
        $averageRating = $student->average_rating ?? 0;
        $totalRatings = $student->total_ratings ?? 0;

        // Ensure averageRating is numeric
        $averageRating = is_numeric($averageRating) ? (float) $averageRating : 0.0;
        $totalRatings = is_numeric($totalRatings) ? (int) $totalRatings : 0;

        // Get upcoming events for the student's club
        $upcomingEvents = Event::where('club_id', $student->club_id)
            ->where('organization_id', $student->organization_id)
            ->where('status', 'upcoming')
            ->where('event_date', '>=', now()->toDateString())
            ->where('is_public', true)
            ->orderBy('event_date', 'asc')
            ->take(3)
            ->get();

        return Inertia::render('Student/Dashboard', [
            'year' => $year,
            'attendanceStats' => [
                'totalDays' => $totalDays,
                'presentDays' => $presentDays,
                'absentDays' => $absentDays,
                'attendanceRate' => $attendanceRate,
            ],
            'paymentStats' => [
                'totalPayments' => $totalPayments,
                'paidPayments' => $paidPayments,
                'pendingPayments' => $pendingPayments,
                'totalAmount' => $totalAmount,
                'paidAmount' => $paidAmount,
            ],
            'ratingStats' => [
                'averageRating' => $averageRating,
                'totalRatings' => $totalRatings,
            ],
            'amountsByCurrency' => $amountsByCurrency,
            'paidAmountsByCurrency' => $paidAmountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
            'upcomingEvents' => $upcomingEvents,
        ]);
    }
}
