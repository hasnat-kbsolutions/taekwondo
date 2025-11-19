<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\Certification;
use App\Models\Rating;
use App\Models\Supporter;
use App\Models\Currency;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    public function index()
    {
        // Get summary statistics for the main reports page
        $summary = [
            'total_organizations' => (int) Organization::count(),
            'total_clubs' => (int) Club::count(),
            'total_students' => (int) Student::count(),
            'total_instructors' => (int) Instructor::count(),
            'total_supporters' => (int) Supporter::count(),
            'total_revenue' => (float) (Payment::where('status', 'paid')->sum('amount') ?? 0),
            'pending_payments' => (float) (Payment::where('status', 'unpaid')->sum('amount') ?? 0),
            'total_certifications' => (int) Certification::count(),
            'total_ratings' => (int) Rating::count(),
        ];

        // Get payment statistics with currency breakdown
        $payments = Payment::with(['student.club.organization', 'currency'])->latest('pay_at')->get();

        // Calculate total amount by currency
        try {
            $amountsByCurrency = $payments->groupBy('currency_code')
                ->map(function ($currencyPayments) {
                    return (float) $currencyPayments->sum('amount');
                });
        } catch (\Exception $e) {
            $amountsByCurrency = [];
        }

        // Get default currency for display
        $defaultCurrency = Currency::where('is_default', true)->first();
        $defaultCurrencyCode = $defaultCurrency ? $defaultCurrency->code : 'MYR';

        // Group by organization for financial summary
        $organizationPayments = $payments->groupBy(function ($payment) {
            return $payment->student->organization->name ?? 'Unknown';
        })->map(function ($orgPayments, $orgName) {
            // Calculate amounts by currency for this organization
            try {
                $orgAmountsByCurrency = $orgPayments->groupBy('currency_code')
                    ->map(function ($currencyPayments) {
                        return (float) $currencyPayments->sum('amount');
                    });
            } catch (\Exception $e) {
                $orgAmountsByCurrency = [];
            }

            return [
                'organization' => $orgName,
                'total_amount' => $orgPayments->sum('amount'),
                'paid_amount' => $orgPayments->where('status', 'paid')->sum('amount'),
                'pending_amount' => $orgPayments->where('status', 'unpaid')->sum('amount'),
                'payment_count' => $orgPayments->count(),
                'paid_count' => $orgPayments->where('status', 'paid')->count(),
                'pending_count' => $orgPayments->where('status', 'unpaid')->count(),
                'amounts_by_currency' => $orgAmountsByCurrency,
            ];
        });

        // Monthly trends with currency breakdown
        $monthlyTrends = $payments->groupBy(function ($payment) {
            return \Carbon\Carbon::parse($payment->month)->format('Y-m');
        })->map(function ($monthPayments, $month) {
            // Calculate amounts by currency for this month
            try {
                $monthlyAmountsByCurrency = $monthPayments->groupBy('currency_code')
                    ->map(function ($currencyPayments) {
                        return (float) $currencyPayments->sum('amount');
                    });
            } catch (\Exception $e) {
                $monthlyAmountsByCurrency = [];
            }

            return [
                'month' => $month,
                'total_amount' => $monthPayments->sum('amount'),
                'paid_amount' => $monthPayments->where('status', 'paid')->sum('amount'),
                'pending_amount' => $monthPayments->where('status', 'unpaid')->sum('amount'),
                'payment_count' => $monthPayments->count(),
                'amounts_by_currency' => $monthlyAmountsByCurrency,
            ];
        });

        // Get organizations with performance data
        $organizations = Organization::withCount(['clubs', 'students', 'instructors'])->get()->map(function ($org) {
            $studentIds = Student::where('organization_id', $org->id)->pluck('id');
            $revenue = Payment::whereIn('student_id', $studentIds)
                ->where('status', 'paid')
                ->sum('amount');

            // Calculate revenue by currency for this organization
            try {
                $orgRevenueByCurrency = Payment::whereIn('student_id', $studentIds)
                    ->where('status', 'paid')
                    ->get()
                    ->groupBy('currency_code')
                    ->map(function ($currencyPayments) {
                        return (float) $currencyPayments->sum('amount');
                    });
            } catch (\Exception $e) {
                $orgRevenueByCurrency = [];
            }

            // Get clubs with detailed information
            $clubs = Club::where('organization_id', $org->id)
                ->withCount(['students'])
                ->get()
                ->map(function ($club) {
                    $clubStudentIds = Student::where('club_id', $club->id)->pluck('id');
                    $clubCertificationsCount = Certification::whereIn('student_id', $clubStudentIds)->count();
                    $clubPendingPayments = Payment::whereIn('student_id', $clubStudentIds)
                        ->where('status', 'unpaid')
                        ->sum('amount');

                    return [
                        'id' => $club->id,
                        'name' => $club->name,
                        'students_count' => $club->students_count,
                        'certifications_count' => $clubCertificationsCount,
                        'pending_payments' => $clubPendingPayments,
                    ];
                });

            // Get students with detailed information
            $students = Student::where('organization_id', $org->id)
                ->with(['club'])
                ->get()
                ->map(function ($student) {
                    $studentCertificationsCount = Certification::where('student_id', $student->id)->count();

                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'club' => $student->club ? [
                            'id' => $student->club->id,
                            'name' => $student->club->name,
                        ] : null,
                        'certifications_count' => $studentCertificationsCount,
                    ];
                });

            return [
                'id' => $org->id,
                'name' => $org->name,
                'clubs_count' => $org->clubs_count,
                'students_count' => $org->students_count,
                'instructors_count' => $org->instructors_count,
                'revenue' => $revenue,
                'revenue_by_currency' => $orgRevenueByCurrency,
                'clubs' => $clubs,
                'students' => $students,
            ];
        });

        return Inertia::render('Admin/Reports/Index', [
            'summary' => $summary,
            'payments' => $payments,
            'organizationPayments' => $organizationPayments,
            'monthlyTrends' => $monthlyTrends,
            'organizations' => $organizations,
            'amountsByCurrency' => $amountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
        ]);
    }

    public function organizationsReport(Request $request)
    {
        $query = Organization::withCount(['clubs', 'students', 'instructors']);

        // Apply filters
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $organizations = $query->get()->map(function ($org) {
            // Get all student IDs for this org
            $studentIds = Student::where('organization_id', $org->id)->pluck('id');

            // Revenue: sum of paid payments
            $revenue = Payment::whereIn('student_id', $studentIds)
                ->where('status', 'paid')
                ->sum('amount');

            // Unpaid: sum of unpaid payments
            $unpaid = Payment::whereIn('student_id', $studentIds)
                ->where('status', '!=', 'paid')
                ->sum('amount');

            // Attendance rate for current month
            $currentMonth = now()->startOfMonth();
            $attendances = Attendance::whereIn('student_id', $studentIds)
                ->whereMonth('date', $currentMonth->month)
                ->whereYear('date', $currentMonth->year)
                ->get();

            $totalDays = $attendances->count();
            $presentDays = $attendances->where('status', 'present')->count();
            $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0;

            // Certifications count
            $certificationsCount = Certification::whereIn('student_id', $studentIds)->count();

            return [
                'id' => $org->id,
                'name' => $org->name,
                'clubs_count' => $org->clubs_count,
                'students_count' => $org->students_count,
                'instructors_count' => $org->instructors_count,
                'revenue' => $revenue,
                'unpaid' => $unpaid,
                'attendance_rate' => $attendanceRate,
                'certifications_count' => $certificationsCount,
            ];
        });

        return Inertia::render('Admin/Reports/Organizations', [
            'organizations' => $organizations,
            'filters' => $request->only(['search']),
        ]);
    }

    public function financialReport(Request $request)
    {
        $query = Payment::with(['student.club.organization']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('method')) {
            $query->where('method', $request->method);
        }

        if ($request->filled('date_from')) {
            $query->where('pay_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('pay_at', '<=', $request->date_to);
        }

        $payments = $query->latest('pay_at')->get();

        // Group by organization
        $organizationPayments = $payments->groupBy('student.organization.name')->map(function ($orgPayments, $orgName) {
            return [
                'organization' => $orgName,
                'total_amount' => $orgPayments->sum('amount'),
                'paid_amount' => $orgPayments->where('status', 'paid')->sum('amount'),
                'pending_amount' => $orgPayments->where('status', 'unpaid')->sum('amount'),
                'payment_count' => $orgPayments->count(),
                'paid_count' => $orgPayments->where('status', 'paid')->count(),
                'pending_count' => $orgPayments->where('status', 'unpaid')->count(),
            ];
        });

        // Monthly trends
        $monthlyTrends = $payments->groupBy(function ($payment) {
            return Carbon::parse($payment->month)->format('Y-m');
        })->map(function ($monthPayments, $month) {
            return [
                'month' => $month,
                'total_amount' => $monthPayments->sum('amount'),
                'paid_amount' => $monthPayments->where('status', 'paid')->sum('amount'),
                'pending_amount' => $monthPayments->where('status', 'unpaid')->sum('amount'),
                'payment_count' => $monthPayments->count(),
            ];
        });

        return Inertia::render('Admin/Reports/Financial', [
            'payments' => $payments,
            'organizationPayments' => $organizationPayments,
            'monthlyTrends' => $monthlyTrends,
            'filters' => $request->only(['status', 'method', 'date_from', 'date_to']),
            'summary' => [
                'total_amount' => (float) ($payments->sum('amount') ?? 0),
                'paid_amount' => (float) ($payments->where('status', 'paid')->sum('amount') ?? 0),
                'pending_amount' => (float) ($payments->where('status', 'unpaid')->sum('amount') ?? 0),
                'total_count' => (int) $payments->count(),
                'paid_count' => (int) $payments->where('status', 'paid')->count(),
                'pending_count' => (int) $payments->where('status', 'unpaid')->count(),
            ],
        ]);
    }

    public function attendanceReport(Request $request)
    {
        $query = Attendance::with(['student.club.organization']);

        // Apply filters
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('organization_id')) {
            $query->whereHas('student.organization', function ($q) use ($request) {
                $q->where('id', $request->organization_id);
            });
        }

        if ($request->filled('club_id')) {
            $query->whereHas('student.club', function ($q) use ($request) {
                $q->where('id', $request->club_id);
            });
        }

        $attendances = $query->get();

        // Group by organization
        $organizationAttendance = $attendances->groupBy('student.organization.name')->map(function ($orgAttendances, $orgName) {
            $totalDays = $orgAttendances->count();
            $presentDays = $orgAttendances->where('status', 'present')->count();
            $absentDays = $orgAttendances->where('status', 'absent')->count();
            $lateDays = $orgAttendances->where('status', 'late')->count();
            $excusedDays = $orgAttendances->where('status', 'excused')->count();

            return [
                'organization' => $orgName,
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'absent_days' => $absentDays,
                'late_days' => $lateDays,
                'excused_days' => $excusedDays,
                'attendance_rate' => $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0,
            ];
        });

        // Monthly trends
        $monthlyTrends = $attendances->groupBy(function ($attendance) {
            return Carbon::parse($attendance->date)->format('Y-m');
        })->map(function ($monthAttendances, $month) {
            $totalDays = $monthAttendances->count();
            $presentDays = $monthAttendances->where('status', 'present')->count();

            return [
                'month' => $month,
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'attendance_rate' => $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0,
            ];
        });

        $organizations = Organization::all(['id', 'name']);
        $clubs = Club::all(['id', 'name']);

        return Inertia::render('Admin/Reports/Attendance', [
            'attendances' => $attendances,
            'organizationAttendance' => $organizationAttendance,
            'monthlyTrends' => $monthlyTrends,
            'organizations' => $organizations,
            'clubs' => $clubs,
            'filters' => $request->only(['date_from', 'date_to', 'status', 'organization_id', 'club_id']),
            'summary' => [
                'total_days' => $attendances->count(),
                'present_days' => $attendances->where('status', 'present')->count(),
                'absent_days' => $attendances->where('status', 'absent')->count(),
                'late_days' => $attendances->where('status', 'late')->count(),
                'excused_days' => $attendances->where('status', 'excused')->count(),
                'overall_rate' => $attendances->count() > 0 ?
                    round(($attendances->where('status', 'present')->count() / $attendances->count()) * 100, 1) : 0,
            ],
        ]);
    }

    public function certificationsReport(Request $request)
    {
        $query = Certification::with(['student.club.organization']);

        // Apply filters
        if ($request->filled('date_from')) {
            $query->where('issued_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('issued_at', '<=', $request->date_to);
        }

        if ($request->filled('organization_id')) {
            $query->whereHas('student.organization', function ($q) use ($request) {
                $q->where('id', $request->organization_id);
            });
        }

        if ($request->filled('club_id')) {
            $query->whereHas('student.club', function ($q) use ($request) {
                $q->where('id', $request->club_id);
            });
        }

        $certifications = $query->latest('issued_at')->get();

        // Group by organization
        $organizationCertifications = $certifications->groupBy('student.organization.name')->map(function ($orgCerts, $orgName) {
            return [
                'organization' => $orgName,
                'total_certifications' => $orgCerts->count(),
                'this_month' => $orgCerts->where('issued_at', '>=', now()->startOfMonth())->count(),
                'this_year' => $orgCerts->where('issued_at', '>=', now()->startOfYear())->count(),
            ];
        });

        // Monthly trends
        $monthlyTrends = $certifications->groupBy(function ($cert) {
            return $cert->issued_at ? Carbon::parse($cert->issued_at)->format('Y-m') : 'No Date';
        })->map(function ($monthCerts, $month) {
            return [
                'month' => $month,
                'count' => $monthCerts->count(),
            ];
        });

        $organizations = Organization::all(['id', 'name']);
        $clubs = Club::all(['id', 'name']);

        return Inertia::render('Admin/Reports/Certifications', [
            'certifications' => $certifications,
            'organizationCertifications' => $organizationCertifications,
            'monthlyTrends' => $monthlyTrends,
            'organizations' => $organizations,
            'clubs' => $clubs,
            'filters' => $request->only(['date_from', 'date_to', 'organization_id', 'club_id']),
            'summary' => [
                'total_certifications' => $certifications->count(),
                'this_month' => $certifications->where('issued_at', '>=', now()->startOfMonth())->count(),
                'this_year' => $certifications->where('issued_at', '>=', now()->startOfYear())->count(),
                'with_files' => $certifications->whereNotNull('file')->count(),
                'without_files' => $certifications->whereNull('file')->count(),
            ],
        ]);
    }

    public function performanceReport(Request $request)
    {
        // Student performance based on attendance and ratings
        $students = Student::with(['club.organization', 'attendances', 'ratingsReceived'])
            ->when($request->filled('organization_id'), function ($query) use ($request) {
                $query->where('organization_id', $request->organization_id);
            })
            ->when($request->filled('club_id'), function ($query) use ($request) {
                $query->where('club_id', $request->club_id);
            })
            ->get()
            ->map(function ($student) {
                // Calculate attendance rate for current month
                $currentMonth = now()->startOfMonth();
                $monthlyAttendances = $student->attendances()
                    ->whereMonth('date', $currentMonth->month)
                    ->whereYear('date', $currentMonth->year)
                    ->get();

                $totalDays = $monthlyAttendances->count();
                $presentDays = $monthlyAttendances->where('status', 'present')->count();
                $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0;

                // Get average rating
                $avgRating = $student->ratingsReceived()->avg('rating') ?? 0;

                // Get payment status
                $pendingPayments = $student->payments()->where('status', 'unpaid')->sum('amount');

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'organization' => $student->organization->name,
                    'club' => $student->club->name,
                    'grade' => $student->grade,
                    'attendance_rate' => $attendanceRate,
                    'avg_rating' => round($avgRating, 1),
                    'pending_payments' => $pendingPayments,
                    'total_attendances' => $student->attendances()->count(),
                    'total_ratings' => $student->ratingsReceived()->count(),
                ];
            });

        // Instructor performance
        $instructors = Instructor::with(['organization', 'club', 'ratingsReceived'])
            ->when($request->filled('organization_id'), function ($query) use ($request) {
                $query->where('organization_id', $request->organization_id);
            })
            ->when($request->filled('club_id'), function ($query) use ($request) {
                $query->where('club_id', $request->club_id);
            })
            ->get()
            ->map(function ($instructor) {
                $avgRating = $instructor->ratingsReceived()->avg('rating') ?? 0;
                $studentCount = $instructor->students()->count();

                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'organization' => $instructor->organization->name,
                    'club' => $instructor->club->name,
                    'grade' => $instructor->grade,
                    'avg_rating' => round($avgRating, 1),
                    'student_count' => $studentCount,
                    'total_ratings' => $instructor->ratingsReceived()->count(),
                ];
            });

        $organizations = Organization::all(['id', 'name']);
        $clubs = Club::all(['id', 'name']);

        return Inertia::render('Admin/Reports/Performance', [
            'students' => $students,
            'instructors' => $instructors,
            'organizations' => $organizations,
            'clubs' => $clubs,
            'filters' => $request->only(['organization_id', 'club_id']),
            'summary' => [
                'total_students' => $students->count(),
                'total_instructors' => $instructors->count(),
                'avg_student_rating' => $students->avg('avg_rating'),
                'avg_instructor_rating' => $instructors->avg('avg_rating'),
                'avg_attendance_rate' => $students->avg('attendance_rate'),
            ],
        ]);
    }

    public function exportReport($type, Request $request)
    {
        switch ($type) {
            case 'organizations':
                return $this->exportOrganizationsReport($request);
            case 'financial':
                return $this->exportFinancialReport($request);
            case 'attendance':
                return $this->exportAttendanceReport($request);
            case 'certifications':
                return $this->exportCertificationsReport($request);
            case 'performance':
                return $this->exportPerformanceReport($request);
            default:
                abort(404);
        }
    }

    private function exportOrganizationsReport(Request $request)
    {
        $organizations = Organization::withCount(['clubs', 'students', 'instructors'])->get();

        $csvData = [];
        $csvData[] = ['Organization', 'Clubs', 'Students', 'Instructors', 'Revenue', 'Unpaid', 'Attendance Rate', 'Certifications'];

        foreach ($organizations as $org) {
            $studentIds = Student::where('organization_id', $org->id)->pluck('id');
            $revenue = Payment::whereIn('student_id', $studentIds)->where('status', 'paid')->sum('amount');
            $unpaid = Payment::whereIn('student_id', $studentIds)->where('status', '!=', 'paid')->sum('amount');

            $csvData[] = [
                $org->name,
                $org->clubs_count,
                $org->students_count,
                $org->instructors_count,
                $revenue,
                $unpaid,
                'N/A', // Attendance rate would need more complex calculation
                Certification::whereIn('student_id', $studentIds)->count(),
            ];
        }

        $filename = 'organizations_report_' . now()->format('Y-m-d') . '.csv';
        return $this->downloadCsv($csvData, $filename);
    }

    private function exportFinancialReport(Request $request)
    {
        $payments = Payment::with(['student.club.organization'])->get();

        $csvData = [];
        $csvData[] = ['Date', 'Student', 'Organization', 'Club', 'Amount', 'Status', 'Method', 'Month'];

        foreach ($payments as $payment) {
            $csvData[] = [
                $payment->pay_at,
                $payment->student->name ?? 'N/A',
                $payment->student->organization->name ?? 'N/A',
                $payment->student->club->name ?? 'N/A',
                $payment->amount,
                $payment->status,
                $payment->method,
                $payment->month,
            ];
        }

        $filename = 'financial_report_' . now()->format('Y-m-d') . '.csv';
        return $this->downloadCsv($csvData, $filename);
    }

    private function exportAttendanceReport(Request $request)
    {
        $attendances = Attendance::with(['student.club.organization'])->get();

        $csvData = [];
        $csvData[] = ['Date', 'Student', 'Organization', 'Club', 'Status', 'Remarks'];

        foreach ($attendances as $attendance) {
            $csvData[] = [
                $attendance->date,
                $attendance->student->name ?? 'N/A',
                $attendance->student->organization->name ?? 'N/A',
                $attendance->student->club->name ?? 'N/A',
                $attendance->status,
                $attendance->remarks,
            ];
        }

        $filename = 'attendance_report_' . now()->format('Y-m-d') . '.csv';
        return $this->downloadCsv($csvData, $filename);
    }

    private function exportCertificationsReport(Request $request)
    {
        $certifications = Certification::with(['student.club.organization'])->get();

        $csvData = [];
        $csvData[] = ['Student', 'Organization', 'Club', 'Issued Date', 'Notes', 'File'];

        foreach ($certifications as $cert) {
            $csvData[] = [
                $cert->student->name ?? 'N/A',
                $cert->student->organization->name ?? 'N/A',
                $cert->student->club->name ?? 'N/A',
                $cert->issued_at,
                $cert->notes,
                $cert->file ? 'Yes' : 'No',
            ];
        }

        $filename = 'certifications_report_' . now()->format('Y-m-d') . '.csv';
        return $this->downloadCsv($csvData, $filename);
    }

    private function exportPerformanceReport(Request $request)
    {
        $students = Student::with(['club.organization', 'attendances', 'ratingsReceived'])->get();

        $csvData = [];
        $csvData[] = ['Student', 'Organization', 'Club', 'Grade', 'Attendance Rate', 'Average Rating', 'Total Ratings'];

        foreach ($students as $student) {
            $currentMonth = now()->startOfMonth();
            $monthlyAttendances = $student->attendances()
                ->whereMonth('date', $currentMonth->month)
                ->whereYear('date', $currentMonth->year)
                ->get();

            $totalDays = $monthlyAttendances->count();
            $presentDays = $monthlyAttendances->where('status', 'present')->count();
            $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0;

            $avgRating = $student->ratingsReceived()->avg('rating') ?? 0;

            $csvData[] = [
                $student->name,
                $student->organization->name ?? 'N/A',
                $student->club->name ?? 'N/A',
                $student->grade,
                $attendanceRate . '%',
                round($avgRating, 1),
                $student->ratingsReceived()->count(),
            ];
        }

        $filename = 'performance_report_' . now()->format('Y-m-d') . '.csv';
        return $this->downloadCsv($csvData, $filename);
    }

    private function downloadCsv($data, $filename)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            foreach ($data as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}