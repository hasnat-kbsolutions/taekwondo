<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Certification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InstructorInsightsController extends Controller
{
    public function show(Request $request)
    {
        $instructor = Auth::user()->userable;

        // Get instructor data
        $instructorData = $this->getInstructorData($instructor, $request);

        // Get student analytics
        $studentData = $this->getStudentAnalytics($instructor, $request);

        // Get attendance analytics
        $attendanceData = $this->getAttendanceAnalytics($instructor, $request);

        // Get payment analytics
        $paymentData = $this->getPaymentAnalytics($instructor, $request);

        // Get recent activity
        $recentActivity = $this->getRecentActivity($instructor);

        return Inertia::render('Instructor/InstructorInsights/Show', [
            'instructor' => $instructor,
            'instructorData' => $instructorData,
            'studentData' => $studentData,
            'attendanceData' => $attendanceData,
            'paymentData' => $paymentData,
            'recentActivity' => $recentActivity,
            'filters' => $request->only(['year', 'month', 'date_range']),
        ]);
    }

    private function getInstructorData($instructor, $request)
    {
        return [
            'name' => $instructor->name,
            'email' => $instructor->email,
            'phone' => $instructor->phone,
            'address' => $this->formatAddress($instructor),
            'status' => $instructor->status ? 'Active' : 'Inactive',
            'certification' => $instructor->certification ?? 'N/A',
            'specialization' => $instructor->specialization ?? 'N/A',
            'join_date' => $instructor->created_at->format('F j, Y'),
            'years_active' => (float) round($instructor->created_at->floatDiffInYears(now()), 2),
            'organization' => $instructor->organization?->name ?? 'N/A',
            'club' => $instructor->club?->name ?? 'N/A',
            'total_students' => $instructor->students()->count(),
            'average_rating' => $this->getAverageRating($instructor),
            'total_ratings' => $this->getTotalRatings($instructor),
        ];
    }

    private function getStudentAnalytics($instructor, $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $students = $instructor->students();

        if ($request->filled('month') && $month !== 'all') {
            $students->whereYear('created_at', $year)->whereMonth('created_at', $month);
        } else {
            $students->whereYear('created_at', $year);
        }

        $newStudents = $students->count();
        $totalStudents = $instructor->students()->count();
        $activeStudents = $instructor->students()->where('status', true)->count();
        $inactiveStudents = $instructor->students()->where('status', false)->count();

        // Get student growth over months
        $monthlyGrowth = $instructor->students()
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
        $studentsByGrade = $instructor->students()
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
        $topStudents = $instructor->students()
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
                    'grade' => $student->grade,
                ];
            });

        // Get students needing attention (low attendance)
        $studentsNeedingAttention = $instructor->students()
            ->withCount([
                'attendances as total_classes',
                'attendances as present_classes' => function ($query) {
                    $query->where('status', 'present');
                }
            ])
            ->having('total_classes', '>', 5) // Only students with at least 5 classes
            ->get()
            ->filter(function ($student) {
                $attendanceRate = $student->total_classes > 0 ? ($student->present_classes / $student->total_classes) * 100 : 0;
                return $attendanceRate < 70; // Less than 70% attendance
            })
            ->sortBy(function ($student) {
                $attendanceRate = $student->total_classes > 0 ? ($student->present_classes / $student->total_classes) * 100 : 0;
                return $attendanceRate;
            })
            ->take(5)
            ->values()
            ->map(function ($student) {
                $attendanceRate = $student->total_classes > 0 ? (float) round(($student->present_classes / $student->total_classes) * 100, 2) : 0.0;
                return [
                    'id' => $student->id,
                    'name' => $student->name . ' ' . $student->surname,
                    'attendance_rate' => $attendanceRate,
                    'total_classes' => $student->total_classes,
                    'present_classes' => $student->present_classes,
                    'grade' => $student->grade,
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
            'students_needing_attention' => $studentsNeedingAttention,
        ];
    }

    private function getAttendanceAnalytics($instructor, $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $attendances = Attendance::whereHas('student', function ($query) use ($instructor) {
            $query->whereIn('id', $instructor->students()->pluck('students.id'));
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

        // Get attendance by student
        $attendanceByStudent = $instructor->students()
            ->withCount([
                'attendances as total_classes',
                'attendances as present_classes' => function ($query) use ($year, $month) {
                    if ($month && $month !== 'all') {
                        $query->whereYear('date', $year)->whereMonth('date', $month);
                    } else {
                        $query->whereYear('date', $year);
                    }
                }
            ])
            ->having('total_classes', '>', 0)
            ->orderByDesc('present_classes')
            ->get()
            ->map(function ($student) {
                $attendanceRate = $student->total_classes > 0 ? (float) round(($student->present_classes / $student->total_classes) * 100, 2) : 0.0;
                return [
                    'student_name' => $student->name . ' ' . $student->surname,
                    'grade' => $student->grade,
                    'total_classes' => $student->total_classes,
                    'present_classes' => $student->present_classes,
                    'attendance_rate' => $attendanceRate,
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
            'attendance_by_student' => $attendanceByStudent,
        ];
    }

    private function getPaymentAnalytics($instructor, $request)
    {
        $year = $request->get('year', now()->year);

        $payments = Payment::whereHas('student', function ($query) use ($instructor) {
            $query->whereIn('id', $instructor->students()->pluck('students.id'));
        })->whereYear('pay_at', $year);

        $totalPaid = (float) $payments->where('status', 'paid')->sum('amount');
        $pendingAmount = (float) $payments->where('status', 'unpaid')->sum('amount');
        $totalAmount = (float) $payments->sum('amount');

        // Get monthly payment breakdown
        $monthlyPayments = $payments->selectRaw('MONTH(pay_at) as month, SUM(amount) as total, SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as paid, SUM(CASE WHEN status = "unpaid" THEN amount ELSE 0 END) as pending')
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

        // Get payment status by student
        $paymentStatusByStudent = $instructor->students()
            ->with([
                'payments' => function ($query) use ($year) {
                    $query->whereYear('pay_at', $year);
                }
            ])
            ->get()
            ->map(function ($student) {
                $totalPaid = (float) $student->payments->where('status', 'paid')->sum('amount');
                $pendingAmount = (float) $student->payments->where('status', 'unpaid')->sum('amount');
                $totalAmount = (float) $student->payments->sum('amount');

                return [
                    'student_name' => $student->name . ' ' . $student->surname,
                    'total_paid' => $totalPaid,
                    'pending_amount' => $pendingAmount,
                    'total_amount' => $totalAmount,
                    'payment_rate' => $totalAmount > 0 ? (float) round(($totalPaid / $totalAmount) * 100, 2) : 0.0,
                ];
            })
            ->sortByDesc('total_paid');

        return [
            'summary' => [
                'total_paid' => $totalPaid,
                'pending_amount' => $pendingAmount,
                'total_amount' => $totalAmount,
                'payment_rate' => $totalAmount > 0 ? (float) round(($totalPaid / $totalAmount) * 100, 2) : 0.0,
            ],
            'monthly_breakdown' => $monthlyPayments,
            'payment_status_by_student' => $paymentStatusByStudent,
        ];
    }

    private function getRecentActivity($instructor)
    {
        $activities = collect();

        // Recent student assignments
        $recentStudents = $instructor->students()
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($student) {
                return [
                    'type' => 'student_assignment',
                    'description' => 'New student assigned: ' . $student->name . ' ' . $student->surname,
                    'date' => $student->created_at,
                    'status' => 'assigned',
                ];
            });

        // Recent payments
        $recentPayments = Payment::whereHas('student', function ($query) use ($instructor) {
            $query->whereIn('id', $instructor->students()->pluck('students.id'));
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

    private function getAverageRating($instructor)
    {
        $ratings = $instructor->ratingsReceived()->avg('rating');
        return $ratings ? (float) round($ratings, 2) : 0.0;
    }

    private function getTotalRatings($instructor)
    {
        return $instructor->ratingsReceived()->count();
    }

    private function formatAddress($instructor)
    {
        $addressParts = array_filter([
            $instructor->street,
            $instructor->city,
            $instructor->postal_code,
            $instructor->country,
        ]);

        return implode(', ', $addressParts);
    }
}
