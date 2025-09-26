<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Certification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ClubInsightsController extends Controller
{
    public function show(Request $request)
    {
        $club = Auth::user()->userable;

        // Get club data
        $clubData = $this->getClubData($club, $request);

        // Get student analytics
        $studentData = $this->getStudentAnalytics($club, $request);

        // Get instructor analytics
        $instructorData = $this->getInstructorAnalytics($club, $request);

        // Get attendance analytics
        $attendanceData = $this->getAttendanceAnalytics($club, $request);

        // Get payment analytics
        $paymentData = $this->getPaymentAnalytics($club, $request);

        // Get recent activity
        $recentActivity = $this->getRecentActivity($club);

        return Inertia::render('Club/ClubInsights/Show', [
            'club' => $club,
            'clubData' => $clubData,
            'studentData' => $studentData,
            'instructorData' => $instructorData,
            'attendanceData' => $attendanceData,
            'paymentData' => $paymentData,
            'recentActivity' => $recentActivity,
            'filters' => $request->only(['year', 'month', 'date_range']),
        ]);
    }

    private function getClubData($club, $request)
    {
        $year = $request->get('year', now()->year);

        return [
            'name' => $club->name,
            'email' => $club->email,
            'phone' => $club->phone,
            'website' => $club->website,
            'address' => $this->formatAddress($club),
            'status' => $club->status ? 'Active' : 'Inactive',
            'currency' => $club->defaultCurrency?->code ?? 'MYR',
            'currency_symbol' => $club->currency_symbol,
            'established_date' => $club->created_at->format('F j, Y'),
            'years_active' => (float) round($club->created_at->floatDiffInYears(now()), 2),
            'organization' => $club->organization?->name ?? 'N/A',
            'total_students' => $club->students()->count(),
            'total_instructors' => $club->instructors()->count(),
        ];
    }

    private function getStudentAnalytics($club, $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $students = $club->students();

        if ($request->filled('month') && $month !== 'all') {
            $students->whereYear('created_at', $year)->whereMonth('created_at', $month);
        } else {
            $students->whereYear('created_at', $year);
        }

        $newStudents = $students->count();
        $totalStudents = $club->students()->count();
        $activeStudents = $club->students()->where('status', true)->count();
        $inactiveStudents = $club->students()->where('status', false)->count();

        // Get student growth over months
        $monthlyGrowth = $club->students()
            ->whereYear('created_at', $year)
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                $monthName = Carbon::create()->month($item->month)->format('M');
                return [
                    'month' => $monthName,
                    'count' => $item->count,
                ];
            });

        // Get students by grade
        $studentsByGrade = $club->students()
            ->selectRaw('grade, COUNT(*) as count')
            ->groupBy('grade')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'grade' => $item->grade,
                    'count' => $item->count,
                ];
            });

        // Get top performing students (by attendance)
        $topStudents = $club->students()
            ->withCount([
                'attendances as total_classes',
                'attendances as present_classes' => function ($query) {
                    $query->where('status', 'present');
                }
            ])
            ->having('total_classes', '>', 0)
            ->orderByDesc('present_classes')
            ->take(5)
            ->get()
            ->map(function ($student) {
                $attendanceRate = $student->total_classes > 0 ? (float) round(($student->present_classes / $student->total_classes) * 100, 2) : 0.0;
                return [
                    'id' => $student->id,
                    'name' => $student->name . ' ' . $student->surname,
                    'attendance_rate' => $attendanceRate,
                    'total_classes' => $student->total_classes,
                    'present_classes' => $student->present_classes,
                ];
            });

        return [
            'summary' => [
                'total_students' => $totalStudents,
                'new_students' => $newStudents,
                'active_students' => $activeStudents,
                'inactive_students' => $inactiveStudents,
                'retention_rate' => $totalStudents > 0 ? (float) round(($activeStudents / $totalStudents) * 100, 2) : 0.0,
            ],
            'monthly_growth' => $monthlyGrowth,
            'students_by_grade' => $studentsByGrade,
            'top_students' => $topStudents,
        ];
    }

    private function getInstructorAnalytics($club, $request)
    {
        $instructors = $club->instructors();

        $totalInstructors = $instructors->count();
        $activeInstructors = $instructors->where('status', true)->count();
        $inactiveInstructors = $instructors->where('status', false)->count();

        // Get instructors with student counts
        $instructorsWithStudents = $instructors->withCount('students')->get()->map(function ($instructor) {
            return [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'students_count' => $instructor->students_count,
                'status' => $instructor->status ? 'Active' : 'Inactive',
                'certification' => $instructor->certification ?? 'N/A',
            ];
        });

        return [
            'summary' => [
                'total_instructors' => $totalInstructors,
                'active_instructors' => $activeInstructors,
                'inactive_instructors' => $inactiveInstructors,
            ],
            'instructors_with_students' => $instructorsWithStudents,
        ];
    }

    private function getAttendanceAnalytics($club, $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $attendances = Attendance::whereHas('student', function ($query) use ($club) {
            $query->where('club_id', $club->id);
        });

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

        $overallAttendanceRate = $totalClasses > 0 ? (float) round(($present / $totalClasses) * 100, 2) : 0.0;

        // Get attendance by instructor
        $attendanceByInstructor = $club->instructors()->with([
            'students.attendances' => function ($query) use ($year, $month) {
                if ($month && $month !== 'all') {
                    $query->whereYear('date', $year)->whereMonth('date', $month);
                } else {
                    $query->whereYear('date', $year);
                }
            }
        ])->get()->map(function ($instructor) {
            $totalClasses = $instructor->students->sum(function ($student) {
                return $student->attendances->count();
            });
            $presentClasses = $instructor->students->sum(function ($student) {
                return $student->attendances->where('status', 'present')->count();
            });

            return [
                'instructor_name' => $instructor->name,
                'total_classes' => $totalClasses,
                'present_classes' => $presentClasses,
                'attendance_rate' => $totalClasses > 0 ? (float) round(($presentClasses / $totalClasses) * 100, 2) : 0.0,
            ];
        });

        return [
            'summary' => [
                'total_classes' => $totalClasses,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'excused' => $excused,
                'overall_attendance_rate' => $overallAttendanceRate,
            ],
            'attendance_by_instructor' => $attendanceByInstructor,
        ];
    }

    private function getPaymentAnalytics($club, $request)
    {
        $year = $request->get('year', now()->year);

        $payments = Payment::whereHas('student', function ($query) use ($club) {
            $query->where('club_id', $club->id);
        })->whereYear('pay_at', $year);

        $totalPaid = (float) $payments->where('status', 'paid')->sum('amount');
        $pendingAmount = (float) $payments->where('status', 'pending')->sum('amount');
        $totalAmount = (float) $payments->sum('amount');

        // Get monthly payment breakdown
        $monthlyPayments = $payments->selectRaw('MONTH(pay_at) as month, SUM(amount) as total, SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as paid, SUM(CASE WHEN status = "pending" THEN amount ELSE 0 END) as pending')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
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
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => ucfirst(str_replace('_', ' ', $item->method)),
                    'total' => (float) $item->total,
                ];
            });

        return [
            'summary' => [
                'total_paid' => $totalPaid,
                'pending_amount' => $pendingAmount,
                'total_amount' => $totalAmount,
                'payment_rate' => $totalAmount > 0 ? (float) round(($totalPaid / $totalAmount) * 100, 2) : 0.0,
            ],
            'monthly_breakdown' => $monthlyPayments,
            'methods' => $paymentMethods,
        ];
    }

    private function getRecentActivity($club)
    {
        $activities = collect();

        // Recent student registrations
        $recentStudents = $club->students()
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($student) {
                return [
                    'type' => 'student_registration',
                    'description' => 'New student registered: ' . $student->name . ' ' . $student->surname,
                    'date' => $student->created_at,
                    'status' => 'registered',
                ];
            });

        // Recent payments
        $recentPayments = Payment::whereHas('student', function ($query) use ($club) {
            $query->where('club_id', $club->id);
        })->orderBy('pay_at', 'desc')->take(5)->get()->map(function ($payment) {
            return [
                'type' => 'payment',
                'description' => ucfirst($payment->status) . ' payment of ' . $payment->formatted_amount,
                'date' => $payment->pay_at,
                'status' => $payment->status,
            ];
        });

        $activities = $activities
            ->concat($recentStudents)
            ->concat($recentPayments)
            ->sortByDesc('date')
            ->take(10)
            ->values();

        return $activities;
    }

    private function formatAddress($club)
    {
        $addressParts = array_filter([
            $club->street,
            $club->city,
            $club->postal_code,
            $club->country,
        ]);

        return implode(', ', $addressParts);
    }
}
