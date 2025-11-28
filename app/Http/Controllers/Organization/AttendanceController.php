<?php

namespace App\Http\Controllers\Organization;
use App\Http\Controllers\Controller;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Club;
use App\Models\Organization;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class AttendanceController extends Controller
{

    public function index(Request $request)
    {
        $organization_id = Auth::user()->userable_id;

        $date = $request->date ? Carbon::parse($request->date . '-01') : null;

        $students = Student::with([
            'attendances' => function ($q) use ($date) {
                if ($date) {
                    $q->whereMonth('date', $date->month)
                        ->whereYear('date', $date->year);
                }
            }
        ])
            ->where('organization_id', $organization_id)
            ->when($request->club_id, fn($q) => $q->where('club_id', $request->club_id))
            ->get();

        $studentsWithAttendance = $students->map(function ($student) {
            $records = $student->attendances->groupBy(function ($a) {
                return Carbon::parse($a->date)->format('Y-m-d');
            })->map(fn($a) => $a->first()->status);

            return [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                ],
                'records' => $records,
            ];
        });

        return Inertia::render('Organization/Attendances/Index', [
            'studentsWithAttendance' => $studentsWithAttendance,
            'clubs' => Club::where('organization_id', $organization_id)->get(),
            'filters' => $request->only('club_id', 'date'), // removed 'organization_id'
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        return Inertia::render('Organization/Attendances/Create', [
            'clubs' => Club::where('organization_id', $organizationId)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
        ]);

        foreach ($request->attendances as $studentId => $attendance) {
            // Verify student belongs to organization
            $student = Student::find($studentId);
            if (!$student || $student->organization_id !== $organizationId) {
                continue;
            }

            Attendance::create([
                'student_id' => $studentId,
                'date' => $request->date,
                'status' => $attendance['status'],
                'remarks' => $attendance['remarks'] ?? null,
            ]);
        }

        return redirect()->route('organization.attendances.index')->with('success', 'Attendance recorded successfully.');
    }

    public function edit($id)
    {
        $attendance = Attendance::with('student')
            ->where('id', $id)
            ->whereHas('student', function ($q) {
                $q->where('organization_id', Auth::user()->userable_id);
            })
            ->firstOrFail();

        return Inertia::render('Organization/Attendances/Edit', [
            'attendance' => $attendance,
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Load student relationship if not loaded
        $attendance->load('student');

        // Verify attendance belongs to organization's student
        if ($attendance->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to update this attendance.');
        }

        $request->validate([
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);

        $attendance->update($request->only('status', 'remarks'));

        return redirect()->route('organization.attendances.index')->with('success', 'Attendance updated successfully.');
    }

    public function filter(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $organizationId = $user->userable_id;

        $request->validate([
            'club_id' => 'nullable|integer',
        ]);

        $students = Student::query()
            ->where('organization_id', $organizationId)
            ->when($request->club_id, fn($q) => $q->where('club_id', $request->club_id))
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json($students);
    }


    public function destroy(Attendance $attendance)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Load student relationship if not loaded
        $attendance->load('student');

        // Verify attendance belongs to organization's student
        if ($attendance->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to delete this attendance.');
        }

        $attendance->delete();
        return redirect()->route('organization.attendances.index')->with('success', 'Attendance deleted successfully.');
    }

    public function toggle(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $organizationId = $user->userable_id;
        $studentId = $request->input('student_id');
        $date = $request->input('date');
        $status = $request->input('status');

        try {
            // Verify student belongs to organization
            $student = Student::find($studentId);
            if (!$student || $student->organization_id !== $organizationId) {
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
