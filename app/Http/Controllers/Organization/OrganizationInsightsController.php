<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Student;
use App\Models\Club;
use App\Models\Instructor;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Certification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrganizationInsightsController extends Controller
{
    public function show(Request $request)
    {
        $organization = Auth::user()->userable;

        // Get organization data
        $organizationData = $this->getOrganizationData($organization, $request);

        // Get student analytics
        $studentData = $this->getStudentAnalytics($organization, $request);

        // Get club analytics
        $clubData = $this->getClubAnalytics($organization, $request);

        // Get instructor analytics
        $instructorData = $this->getInstructorAnalytics($organization, $request);

        // Get attendance analytics
        $attendanceData = $this->getAttendanceAnalytics($organization, $request);

        // Get payment analytics
        $paymentData = $this->getPaymentAnalytics($organization, $request);

        // Get recent activity
        $recentActivity = $this->getRecentActivity($organization);

        return Inertia::render('Organization/OrganizationInsights/Show', [
            'organization' => $organization,
            'organizationData' => $organizationData,
            'studentData' => $studentData,
            'clubData' => $clubData,
            'instructorData' => $instructorData,
            'attendanceData' => $attendanceData,
            'paymentData' => $paymentData,
            'recentActivity' => $recentActivity,
            'filters' => $request->only(['year', 'month', 'date_range']),
        ]);
    }

    private function getOrganizationData($organization, $request)
    {
        $year = $request->get('year', now()->year);

        return [
            'name' => $organization->name,
            'email' => $organization->email,
            'phone' => $organization->phone,
            'website' => $organization->website,
            'address' => $this->formatAddress($organization),
            'status' => $organization->status ? 'Active' : 'Inactive',
            'currency' => $organization->defaultCurrency?->code ?? 'MYR',
            'currency_symbol' => $organization->currency_symbol,
            'established_date' => $organization->created_at->format('F j, Y'),
            'years_active' => (float) round($organization->created_at->floatDiffInYears(now()), 2),
            'total_clubs' => $organization->clubs()->count(),
            'total_students' => $organization->students()->count(),
            'total_instructors' => $organization->instructors()->count(),
        ];
    }

    private function getStudentAnalytics($organization, $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $students = $organization->students();

        if ($request->filled('month') && $month !== 'all') {
            $students->whereYear('created_at', $year)->whereMonth('created_at', $month);
        } else {
            $students->whereYear('created_at', $year);
        }

        $newStudents = $students->count();
        $totalStudents = $organization->students()->count();
        $activeStudents = $organization->students()->where('status', true)->count();
        $inactiveStudents = $organization->students()->where('status', false)->count();

        // Get student growth over months
        $monthlyGrowth = $organization->students()
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
        $studentsByGrade = $organization->students()
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
        ];
    }

    private function getClubAnalytics($organization, $request)
    {
        $clubs = $organization->clubs();

        $totalClubs = $clubs->count();
        $activeClubs = $clubs->where('status', true)->count();
        $inactiveClubs = $clubs->where('status', false)->count();

        // Get clubs with student counts
        $clubsWithStudents = $clubs->withCount('students')->get()->map(function ($club) {
            return [
                'id' => $club->id,
                'name' => $club->name,
                'students_count' => $club->students_count,
                'status' => $club->status ? 'Active' : 'Inactive',
                'city' => $club->city,
                'country' => $club->country,
            ];
        });

        return [
            'summary' => [
                'total_clubs' => $totalClubs,
                'active_clubs' => $activeClubs,
                'inactive_clubs' => $inactiveClubs,
            ],
            'clubs_with_students' => $clubsWithStudents,
        ];
    }

    private function getInstructorAnalytics($organization, $request)
    {
        $instructors = $organization->instructors();

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
                'club' => $instructor->club?->name ?? 'N/A',
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

    private function getAttendanceAnalytics($organization, $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $attendances = Attendance::whereHas('student', function ($query) use ($organization) {
            $query->where('organization_id', $organization->id);
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

        // Get attendance by club
        $attendanceByClub = $organization->clubs()->with([
            'students.attendances' => function ($query) use ($year, $month) {
                if ($month && $month !== 'all') {
                    $query->whereYear('date', $year)->whereMonth('date', $month);
                } else {
                    $query->whereYear('date', $year);
                }
            }
        ])->get()->map(function ($club) {
            $totalClasses = $club->students->sum(function ($student) {
                return $student->attendances->count();
            });
            $presentClasses = $club->students->sum(function ($student) {
                return $student->attendances->where('status', 'present')->count();
            });

            return [
                'club_name' => $club->name,
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
            'attendance_by_club' => $attendanceByClub,
        ];
    }

    private function getPaymentAnalytics($organization, $request)
    {
        $year = $request->get('year', now()->year);

        $payments = Payment::whereHas('student', function ($query) use ($organization) {
            $query->where('organization_id', $organization->id);
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

        return [
            'summary' => [
                'total_paid' => $totalPaid,
                'pending_amount' => $pendingAmount,
                'total_amount' => $totalAmount,
                'payment_rate' => $totalAmount > 0 ? (float) round(($totalPaid / $totalAmount) * 100, 2) : 0.0,
            ],
            'monthly_breakdown' => $monthlyPayments,
        ];
    }

    private function getRecentActivity($organization)
    {
        $activities = collect();

        // Recent student registrations
        $recentStudents = $organization->students()
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
        $recentPayments = Payment::whereHas('student', function ($query) use ($organization) {
            $query->where('organization_id', $organization->id);
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

    private function formatAddress($organization)
    {
        $addressParts = array_filter([
            $organization->street,
            $organization->city,
            $organization->postal_code,
            $organization->country,
        ]);

        return implode(', ', $addressParts);
    }
}
