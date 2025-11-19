<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Certification;
use App\Models\Rating;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentInsightsController extends Controller
{
    public function show(Request $request, $id)
    {
        $student = Student::with([
            'organization',
            'club',
            'instructors',
            'user'
        ])->findOrFail($id);

        // Add student join/start information
        $studentData = $this->getStudentJoinInfo($student);

        // Get attendance data
        $attendanceData = $this->getAttendanceInsights($student, $request);

        // Get payment data
        $paymentData = $this->getPaymentInsights($student, $request);

        // Get certification data
        $certificationData = $this->getCertificationInsights($student);

        // Get rating data
        $ratingData = $this->getRatingInsights($student);

        // Get performance analytics
        $performanceData = $this->getPerformanceAnalytics($student, $request);

        // Get recent activity
        $recentActivity = $this->getRecentActivity($student);

        return Inertia::render('Admin/StudentInsights/Show', [
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
            'is_new_student' => $durationInMonths < 3, // Less than 3 months
            'is_senior_student' => $durationInYears >= 5, // 5+ years
        ];
    }

    private function getAttendanceInsights($student, $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        // Get all attendance records for the student
        $attendances = $student->attendances()
            ->when($request->filled('year'), function ($query) use ($year) {
                $query->whereYear('date', $year);
            })
            ->when($request->filled('month') && $month !== 'all', function ($query) use ($month) {
                $query->whereMonth('date', $month);
            })
            ->when($request->filled('date_range'), function ($query) use ($request) {
                $dates = explode(' to ', $request->date_range);
                if (count($dates) === 2) {
                    $query->whereBetween('date', [Carbon::parse($dates[0]), Carbon::parse($dates[1])]);
                }
            })
            ->orderBy('date', 'desc')
            ->get();

        // Calculate statistics
        $totalClasses = $attendances->count();
        $present = $attendances->where('status', 'present')->count();
        $absent = $attendances->where('status', 'absent')->count();
        $late = $attendances->where('status', 'late')->count();
        $excused = $attendances->where('status', 'excused')->count();

        $attendanceRate = $totalClasses > 0 ? (float) round(($present / $totalClasses) * 100, 2) : 0.0;

        // Get monthly breakdown
        $monthlyBreakdown = $attendances->groupBy(function ($attendance) {
            return Carbon::parse($attendance->date)->format('Y-m');
        })->map(function ($monthAttendances) {
            $total = $monthAttendances->count();
            $present = $monthAttendances->where('status', 'present')->count();
            return [
                'month' => Carbon::parse($monthAttendances->first()->date)->format('M Y'),
                'total' => $total,
                'present' => $present,
                'rate' => $total > 0 ? (float) round(($present / $total) * 100, 2) : 0.0,
                'absent' => $monthAttendances->where('status', 'absent')->count(),
                'late' => $monthAttendances->where('status', 'late')->count(),
                'excused' => $monthAttendances->where('status', 'excused')->count(),
            ];
        })->values();

        // Get attendance patterns
        $dayOfWeekPattern = $attendances->groupBy(function ($attendance) {
            return Carbon::parse($attendance->date)->dayOfWeek;
        })->map(function ($dayAttendances, $dayOfWeek) {
            $dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $total = $dayAttendances->count();
            $present = $dayAttendances->where('status', 'present')->count();
            return [
                'day' => $dayNames[$dayOfWeek],
                'total' => $total,
                'present' => $present,
                'rate' => $total > 0 ? (float) round(($present / $total) * 100, 2) : 0.0,
            ];
        })->values();

        // Get current streak
        $currentStreak = $this->calculateCurrentStreak($attendances);

        // Get longest streak
        $longestStreak = $this->calculateLongestStreak($attendances);

        return [
            'summary' => [
                'total_classes' => $totalClasses,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'excused' => $excused,
                'attendance_rate' => $attendanceRate,
                'current_streak' => $currentStreak,
                'longest_streak' => $longestStreak,
            ],
            'monthly_breakdown' => $monthlyBreakdown,
            'day_pattern' => $dayOfWeekPattern,
            'recent_attendances' => $attendances->take(10)->map(function ($attendance) {
                return [
                    'date' => $attendance->date,
                    'status' => $attendance->status,
                    'remarks' => $attendance->remarks,
                ];
            }),
        ];
    }

    private function getPaymentInsights($student, $request)
    {
        $year = $request->get('year', now()->year);

        $payments = $student->payments()
            ->with('currency')
            ->when($request->filled('year'), function ($query) use ($year) {
                $query->whereYear('pay_at', $year);
            })
            ->orderBy('pay_at', 'desc')
            ->get();

        $totalPaid = (float) $payments->where('status', 'paid')->sum('amount');
        $pendingAmount = (float) $payments->where('status', 'unpaid')->sum('amount');
        $totalAmount = (float) $payments->sum('amount');

        // Get monthly payment breakdown
        $monthlyPayments = $payments->groupBy(function ($payment) {
            return Carbon::parse($payment->pay_at)->format('Y-m');
        })->map(function ($monthPayments, $month) {
            return [
                'month' => Carbon::parse($month . '-01')->format('M Y'),
                'total' => (float) $monthPayments->sum('amount'),
                'paid' => (float) $monthPayments->where('status', 'paid')->sum('amount'),
                'pending' => (float) $monthPayments->where('status', 'unpaid')->sum('amount'),
                'count' => $monthPayments->count(),
            ];
        })->values();

        // Get payment methods breakdown
        $paymentMethods = $payments->groupBy('method')->map(function ($methodPayments, $method) {
            return [
                'method' => ucfirst($method),
                'count' => $methodPayments->count(),
                'total' => (float) $methodPayments->sum('amount'),
            ];
        })->values();

        return [
            'summary' => [
                'total_paid' => $totalPaid,
                'pending_amount' => $pendingAmount,
                'total_amount' => $totalAmount,
                'payment_rate' => $totalAmount > 0 ? (float) round(($totalPaid / $totalAmount) * 100, 2) : 0.0,
                'total_payments' => $payments->count(),
            ],
            'monthly_breakdown' => $monthlyPayments,
            'methods' => $paymentMethods,
            'recent_payments' => $payments->take(10)->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => (float) $payment->amount,
                    'currency' => $payment->currency_code,
                    'status' => $payment->status,
                    'method' => $payment->method,
                    'payment_month' => $payment->month,
                    'pay_at' => $payment->pay_at,
                    'notes' => $payment->notes,
                ];
            }),
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
        $clubAverage = Attendance::whereHas('student', function ($query) use ($student) {
            $query->where('club_id', $student->club_id);
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
                    'description' => ucfirst($attendance->status) . ' on ' . Carbon::parse($attendance->date)->format('M d, Y'),
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
                    'description' => 'New certification issued',
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

    private function calculateCurrentStreak($attendances)
    {
        $sortedAttendances = $attendances->sortByDesc('date');
        $streak = 0;

        foreach ($sortedAttendances as $attendance) {
            if (in_array($attendance->status, ['present', 'late'])) {
                $streak++;
            } else {
                break;
            }
        }

        return $streak;
    }

    private function calculateLongestStreak($attendances)
    {
        $sortedAttendances = $attendances->sortBy('date');
        $maxStreak = 0;
        $currentStreak = 0;

        foreach ($sortedAttendances as $attendance) {
            if (in_array($attendance->status, ['present', 'late'])) {
                $currentStreak++;
                $maxStreak = max($maxStreak, $currentStreak);
            } else {
                $currentStreak = 0;
            }
        }

        return $maxStreak;
    }
}
