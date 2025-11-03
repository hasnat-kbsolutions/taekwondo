<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Certification;
use App\Models\Rating;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentInsightsController extends Controller
{
    public function show(Request $request)
    {
        $student = Auth::user()->userable;

        // Load student with relationships
        $student = $student->load(['club', 'organization', 'instructors']);

        // Get student data
        $studentData = $this->getStudentJoinInfo($student);

        // Get attendance insights
        $attendanceData = $this->getAttendanceInsights($student, $request);

        // Get payment insights
        $paymentData = $this->getPaymentInsights($student, $request);

        // Get certification data
        $certificationData = $this->getCertificationInsights($student);

        // Get rating data
        $ratingData = $this->getRatingInsights($student);

        // Get performance analytics
        $performanceData = $this->getPerformanceAnalytics($student, $request);

        // Get recent activity
        $recentActivity = $this->getRecentActivity($student);

        return Inertia::render('Student/StudentInsights/Show', [
            'student' => $student,
            'studentData' => $studentData,
            'attendanceData' => $attendanceData,
            'paymentData' => $paymentData,
            'certificationData' => $certificationData,
            'ratingData' => $ratingData,
            'performanceData' => $performanceData,
            'recentActivity' => $recentActivity,
            'filters' => $request->only(['year', 'month', 'date_range']),
        ]);
    }

    private function getStudentJoinInfo($student)
    {
        $joinDate = is_string($student->created_at) ? Carbon::parse($student->created_at) : $student->created_at;
        $joinYear = $joinDate->year;
        $joinMonth = $joinDate->format('F');
        $joinDay = $joinDate->format('j');
        $joinFullDate = $joinDate->format('F j, Y');

        // Calculate duration
        $duration = $joinDate->diffForHumans();
        $durationInYears = (float) round($joinDate->floatDiffInYears(now()), 2);
        $durationInMonths = (float) round($joinDate->floatDiffInMonths(now()), 2);

        // Calculate age when joined
        $ageAtJoin = null;
        if ($student->dob) {
            $dob = is_string($student->dob) ? Carbon::parse($student->dob) : $student->dob;
            $ageAtJoin = (float) round($dob->floatDiffInYears($joinDate), 2);
        }

        return [
            'join_date' => $joinFullDate,
            'join_year' => $joinYear,
            'join_month' => $joinMonth,
            'join_day' => $joinDay,
            'duration' => $duration,
            'duration_years' => $durationInYears,
            'duration_months' => $durationInMonths,
            'age_at_join' => $ageAtJoin,
            'is_new_student' => $durationInMonths < 3,
            'is_senior_student' => $durationInYears >= 5,
        ];
    }

    private function getAttendanceInsights($student, $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $attendances = $student->attendances();

        if ($request->filled('month') && $month !== 'all') {
            $attendances->whereYear('date', $year)->whereMonth('date', $month);
        } else {
            $attendances->whereYear('date', $year);
        }

        $totalClasses = $attendances->count();
        $present = $attendances->where('status', 'present')->count();
        $absent = $attendances->where('status', 'absent')->count();
        $late = $attendances->where('status', 'late')->count();
        $excused = $attendances->where('status', 'excused')->count();

        $attendanceRate = $totalClasses > 0 ? (float) round(($present / $totalClasses) * 100, 2) : 0.0;

        // Get monthly breakdown
        $monthlyBreakdown = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthAttendances = $student->attendances()
                ->whereYear('date', $year)
                ->whereMonth('date', $i);

            $monthTotal = $monthAttendances->count();
            $monthPresent = $monthAttendances->where('status', 'present')->count();
            $monthRate = $monthTotal > 0 ? (float) round(($monthPresent / $monthTotal) * 100, 2) : 0.0;

            $monthlyBreakdown[] = [
                'month' => Carbon::create()->month($i)->format('M'),
                'total' => $monthTotal,
                'present' => $monthPresent,
                'rate' => $monthRate,
            ];
        }

        // Get day pattern analysis
        $dayPatterns = $student->attendances()
            ->selectRaw('DAYOFWEEK(date) as day_of_week, COUNT(*) as total, SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present')
            ->whereYear('date', $year)
            ->groupBy('day_of_week')
            ->get()
            ->map(function ($item) {
                $dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return [
                    'day' => $dayNames[$item->day_of_week - 1],
                    'total' => $item->total,
                    'present' => $item->present,
                    'rate' => $item->total > 0 ? (float) round(($item->present / $item->total) * 100, 2) : 0.0,
                ];
            });

        // Get recent attendances
        $recentAttendances = $student->attendances()
            ->orderBy('date', 'desc')
            ->take(10)
            ->get()
            ->map(function ($attendance) {
                return [
                    'date' => $attendance->date,
                    'status' => $attendance->status,
                    'remarks' => $attendance->remarks,
                ];
            });

        return [
            'summary' => [
                'total_classes' => $totalClasses,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'excused' => $excused,
                'attendance_rate' => $attendanceRate,
                'current_streak' => 0, // TODO: Calculate streak
                'longest_streak' => 0, // TODO: Calculate streak
            ],
            'monthly_breakdown' => $monthlyBreakdown,
            'day_pattern' => $dayPatterns,
            'recent_attendances' => $recentAttendances,
        ];
    }

    private function getPaymentInsights($student, $request)
    {
        $year = $request->get('year', now()->year);

        $payments = $student->payments()->whereYear('pay_at', $year);

        $totalPaid = (float) $payments->where('status', 'paid')->sum('amount');
        $pendingAmount = (float) $payments->where('status', 'unpaid')->sum('amount');
        $totalAmount = (float) $payments->sum('amount');

        $paymentRate = $totalAmount > 0 ? (float) round(($totalPaid / $totalAmount) * 100, 2) : 0.0;

        // Get monthly payment breakdown
        $monthlyPayments = $payments->selectRaw('MONTH(pay_at) as month, SUM(amount) as total, SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as paid, SUM(CASE WHEN status = "unpaid" THEN amount ELSE 0 END) as pending')
            ->groupBy('month')
            ->get()
            ->sortBy('month')
            ->map(function ($item) {
                $monthName = Carbon::create()->month($item->month)->format('M');
                return [
                    'month' => $monthName,
                    'total' => (float) $item->total,
                    'paid' => (float) $item->paid,
                    'pending' => (float) $item->pending,
                ];
            });

        // Get payment methods
        $paymentMethods = $payments->selectRaw('method, SUM(amount) as total')
            ->groupBy('method')
            ->get()
            ->sortByDesc('total')
            ->map(function ($item) {
                return [
                    'method' => ucfirst(str_replace('_', ' ', $item->method)),
                    'total' => (float) $item->total,
                ];
            });

        // Get recent payments
        $recentPayments = $student->payments()->whereYear('pay_at', $year)->orderBy('pay_at', 'desc')->take(5)->get()->map(function ($payment) {
            return [
                'id' => $payment->id,
                'amount' => (float) $payment->amount,
                'status' => $payment->status,
                'method' => $payment->method,
                'pay_at' => $payment->pay_at,
                'formatted_amount' => $payment->formatted_amount,
            ];
        });

        return [
            'summary' => [
                'total_paid' => $totalPaid,
                'pending_amount' => $pendingAmount,
                'total_amount' => $totalAmount,
                'payment_rate' => $paymentRate,
            ],
            'monthly_breakdown' => $monthlyPayments,
            'methods' => $paymentMethods,
            'recent_payments' => $recentPayments,
        ];
    }

    private function getCertificationInsights($student)
    {
        $certifications = $student->certifications()->orderBy('issued_at', 'desc')->get();

        return [
            'total' => $certifications->count(),
            'recent' => $certifications->take(5)->map(function ($certification) {
                return [
                    'id' => $certification->id,
                    'file' => $certification->file,
                    'issued_at' => $certification->issued_at,
                    'notes' => $certification->notes,
                ];
            }),
        ];
    }

    private function getRatingInsights($student)
    {
        $ratingsReceived = $student->ratingsReceived()->with('rater')->get();
        $ratingsGiven = $student->ratingsGiven()->with('rated')->get();

        $averageRating = $ratingsReceived->avg('rating') ?? 0;
        $totalRatings = $ratingsReceived->count();

        return [
            'received' => [
                'average' => (float) round($averageRating, 2),
                'total' => $totalRatings,
                'breakdown' => $ratingsReceived->groupBy('rating')->map(function ($ratingGroup, $rating) {
                    return [
                        'rating' => $rating,
                        'count' => $ratingGroup->count(),
                    ];
                })->values(),
                'recent' => $ratingsReceived->take(5)->map(function ($rating) {
                    return [
                        'id' => $rating->id,
                        'rating' => $rating->rating,
                        'comment' => $rating->comment,
                        'rater' => $rating->rater->name ?? 'Unknown',
                        'created_at' => $rating->created_at,
                    ];
                }),
            ],
            'given' => [
                'total' => $ratingsGiven->count(),
                'recent' => $ratingsGiven->take(5)->map(function ($rating) {
                    return [
                        'id' => $rating->id,
                        'rating' => $rating->rating,
                        'comment' => $rating->comment,
                        'rated' => $rating->rated->name ?? 'Unknown',
                        'created_at' => $rating->created_at,
                    ];
                }),
            ],
        ];
    }

    private function getPerformanceAnalytics($student, $request)
    {
        $year = $request->get('year', now()->year);

        // Get attendance trend over time
        $attendanceTrend = $student->attendances()
            ->whereYear('date', $year)
            ->selectRaw('DATE(date) as date, COUNT(*) as total, SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'total' => $item->total,
                    'present' => $item->present,
                    'rate' => $item->total > 0 ? (float) round(($item->present / $item->total) * 100, 2) : 0.0,
                ];
            });

        // Compare with club average
        $club = $student->club;
        $clubAverage = Attendance::whereHas('student', function ($query) use ($club) {
            $query->where('club_id', $club->id);
        })
            ->whereYear('date', $year)
            ->selectRaw('COUNT(*) as total, SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present')
            ->first();

        $clubAverageRate = $clubAverage && $clubAverage->total > 0
            ? (float) round(($clubAverage->present / $clubAverage->total) * 100, 2)
            : 0.0;

        return [
            'attendance_trend' => $attendanceTrend,
            'club_comparison' => [
                'student_rate' => $this->getAttendanceInsights($student, $request)['summary']['attendance_rate'],
                'club_average' => $clubAverageRate,
                'performance' => $this->getAttendanceInsights($student, $request)['summary']['attendance_rate'] >= $clubAverageRate ? 'above' : 'below',
            ],
        ];
    }

    private function getRecentActivity($student)
    {
        $activities = collect();

        // Recent attendances
        $recentAttendances = $student->attendances()
            ->orderBy('date', 'desc')
            ->take(5)
            ->get()
            ->map(function ($attendance) {
                return [
                    'type' => 'attendance',
                    'description' => 'Attendance marked as ' . $attendance->status,
                    'date' => $attendance->date,
                    'status' => $attendance->status,
                ];
            });

        // Recent payments
        $recentPayments = $student->payments()
            ->orderBy('pay_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'type' => 'payment',
                    'description' => ucfirst($payment->status) . ' payment of ' . $payment->formatted_amount,
                    'date' => $payment->pay_at,
                    'status' => $payment->status,
                ];
            });

        // Recent certifications
        $recentCertifications = $student->certifications()
            ->orderBy('issued_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($certification) {
                return [
                    'type' => 'certification',
                    'description' => 'Certificate issued on ' . $certification->issued_at,
                    'date' => $certification->issued_at,
                    'status' => 'issued',
                ];
            });

        $activities = $activities
            ->concat($recentAttendances)
            ->concat($recentPayments)
            ->concat($recentCertifications)
            ->sortByDesc('date')
            ->take(10)
            ->values();

        return $activities;
    }
}
