<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user()->userable;
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->format('m'));

        // Get attendances for the selected month
        $attendances = $student->attendances()
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get()
            ->keyBy(fn($a) => Carbon::parse($a->date)->format('Y-m-d'));

        // Calculate statistics
        $totalPresent = $attendances->where('status', 'present')->count();
        $totalAbsent = $attendances->where('status', 'absent')->count();
        $totalLate = $attendances->where('status', 'late')->count();
        $totalExcused = $attendances->where('status', 'excused')->count();

        // Get holidays for this month
        $organizationId = $student->organization_id;
        $clubId = $student->club_id;
        $holidays = Holiday::getForMonth($year, $month, $organizationId, $clubId);

        return Inertia::render('Student/Attendences/Index', [
            'attendance' => $attendances->map(fn($a) => $a->status),
            'holidays' => $holidays,
            'stats' => [
                'present' => $totalPresent,
                'absent' => $totalAbsent,
                'late' => $totalLate,
                'excused' => $totalExcused,
            ],
            'filters' => [
                'year' => (int) $year,
                'month' => $month,
            ],
        ]);
    }
}
