<?php

namespace App\Http\Controllers\Club;
use App\Http\Controllers\Controller;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Club;
use App\Models\Organization;
use App\Models\Holiday;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class AttendanceController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;
        $organizationId = $user->userable->organization_id;

        // Parse date filter
        $year = $request->date ? substr($request->date, 0, 4) : now()->year;
        $month = $request->date ? substr($request->date, 5, 2) : now()->format('m');
        $date = Carbon::parse("{$year}-{$month}-01");

        // Build students query with proper filtering
        $students = Student::with([
            'attendances' => function ($q) use ($date) {
                $q->whereMonth('date', $date->month)
                    ->whereYear('date', $date->year);
            }
        ])
            ->where('club_id', $clubId)
            ->where('organization_id', $organizationId)
            ->orderBy('name')
            ->get();

        $studentsWithAttendance = $students->map(function ($student) {
            $records = $student->attendances->groupBy(
                fn($a) => Carbon::parse($a->date)->format('Y-m-d')
            )->map(fn($a) => $a->first()->status);

            return [
                'student' => [
                    'id' => $student->id,
                    'code' => $student->code,
                    'name' => $student->name,
                ],
                'records' => $records,
            ];
        });

        // Get holidays for this month (organization and club level)
        $holidays = Holiday::getForMonth($year, $month, $organizationId, $clubId);

        return Inertia::render('Club/Attendances/Index', [
            'studentsWithAttendance' => $studentsWithAttendance,
            'holidays' => $holidays,
            'filters' => [
                'date' => $request->date ?? "{$year}-{$month}",
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Club/Attendances/Create', []);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;
        $organizationId = $user->userable->organization_id;

        $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
        ]);

        foreach ($request->attendances as $studentId => $attendance) {
            // Verify student belongs to this club
            $student = Student::find($studentId);
            if (!$student || $student->club_id !== $clubId || $student->organization_id !== $organizationId) {
                continue;
            }

            Attendance::create([
                'student_id' => $studentId,
                'date' => $request->date,
                'status' => $attendance['status'],
                'remarks' => $attendance['remarks'] ?? null,
            ]);
        }

        return redirect()->route('club.attendances.index')->with('success', 'Attendance recorded successfully.');
    }

    public function edit($id)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;
        $organizationId = $user->userable->organization_id;

        $attendance = Attendance::with('student')
            ->where('id', $id)
            ->whereHas('student', function ($q) use ($clubId, $organizationId) {
                $q->where('club_id', $clubId);
                $q->where('organization_id', $organizationId);
            })
            ->firstOrFail();

        return Inertia::render('Club/Attendances/Edit', [
            'attendance' => $attendance,
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;
        $organizationId = $user->userable->organization_id;

        // Load student relationship
        $attendance->load('student');

        // Verify attendance belongs to this club's student
        if ($attendance->student->club_id !== $clubId || $attendance->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to update this attendance.');
        }

        $request->validate([
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);

        $attendance->update($request->only('status', 'remarks'));

        return redirect()->route('club.attendances.index')->with('success', 'Attendance updated successfully.');
    }

    public function filter(Request $request)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;
        $organizationId = $user->userable->organization_id;

        $students = Student::query()
            ->where('organization_id', $organizationId)
            ->where('club_id', $clubId)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json($students);
    }


    public function destroy(Attendance $attendance)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;
        $organizationId = $user->userable->organization_id;

        // Load student relationship
        $attendance->load('student');

        // Verify attendance belongs to this club's student
        if ($attendance->student->club_id !== $clubId || $attendance->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to delete this attendance.');
        }

        $attendance->delete();
        return redirect()->route('club.attendances.index')->with('success', 'Attendance deleted successfully.');
    }

    public function toggle(Request $request)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;
        $organizationId = $user->userable->organization_id;

        $studentId = $request->input('student_id');
        $date = $request->input('date');
        $status = $request->input('status');

        try {
            // Verify student belongs to this club
            $student = Student::find($studentId);
            if (!$student || $student->club_id !== $clubId || $student->organization_id !== $organizationId) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            Attendance::updateOrCreate(
                ['student_id' => $studentId, 'date' => $date],
                ['status' => $status]
            );

            return response()->json(['success' => true, 'message' => 'Attendance updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update attendance'], 500);
        }
    }

}
