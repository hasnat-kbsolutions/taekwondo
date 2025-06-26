<?php

namespace App\Http\Controllers\Branch;
use App\Http\Controllers\Controller;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class AttendanceController extends Controller
{

    public function index(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date . '-01') : null;

        $query = Student::with([
            'attendances' => function ($q) use ($date) {
                if ($date) {
                    $q->whereMonth('date', $date->month)
                        ->whereYear('date', $date->year);
                }
            }
        ]);

        // Always apply auth-based filtering for organization user
        if (Auth::user()->role === 'branch') {
            $query->where('branch_id', Auth::user()->userable_id);
            $query->where('organization_id', Auth::user()->userable->organization_id);
        }

        // Apply optional filters
        $query
            // ->when($request->branch_id, fn($q) => $q->where('branch_id', $request->branch_id))
            ->when($request->club_id, fn($q) => $q->where('club_id', $request->club_id));

        $students = $query->get();

        $studentsWithAttendance = $students->map(function ($student) {
            $records = $student->attendances->groupBy(
                fn($a) =>
                \Carbon\Carbon::parse($a->date)->format('Y-m-d')
            )->map(fn($a) => $a->first()->status);

            return [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                ],
                'records' => $records,
            ];
        });

        return Inertia::render('Branch/Attendances/Index', [ // or Admin/ based on role
            'studentsWithAttendance' => $studentsWithAttendance,
            // 'branches' => Branch::all(),
            'clubs' => Club::all(),
            'filters' => $request->only('branch_id', 'club_id', 'date'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Branch/Attendances/Create', [
            // 'branches' => Branch::all(),
            // 'organizations' => Organization::all(),
            'clubs' => Club::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
        ]);

        foreach ($request->attendances as $studentId => $attendance) {
            Attendance::create([
                'student_id' => $studentId,
                'date' => $request->date,
                'status' => $attendance['status'],
                'remarks' => $attendance['remarks'] ?? null,
            ]);
        }

        return redirect()->route('branch.attendances.index')->with('success', 'Attendance recorded successfully.');
    }

    public function edit($id)
    {
        $attendance = Attendance::with('student')
            ->where('id', $id)
            ->whereHas('student', function ($q) {
                $q->where('branch_id', Auth::user()->userable_id);
                $q->where('organization_id', Auth::user()->userable->organization_id);
            })
            ->firstOrFail();

        return Inertia::render('Branch/Attendances/Edit', [
            'attendance' => $attendance,
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $request->validate([
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);

        $attendance->update($request->only('status', 'remarks'));

        return redirect()->route('branch.attendances.index')->with('success', 'Attendance updated successfully.');
    }

    public function filter(Request $request)
    {
        $request->validate([
            'branch_id' => 'nullable|integer',
            'club_id' => 'nullable|integer',
        ]);

        $students = Student::query()
            ->where('organization_id', Auth::user()->userable->organization_id)
            ->where('branch_id', Auth::user()->userable_id)
            // ->when($request->branch_id, fn($q) => $q->where('branch_id', $request->branch_id))
            ->when($request->club_id, fn($q) => $q->where('club_id', $request->club_id))
            ->get();

        return response()->json($students);
    }


    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->route('branch.attendances.index')->with('success', 'Attendance deleted successfully.');
    }

    public function toggle(Request $request)
    {
        $studentId = $request->input('student_id');
        $date = $request->input('date');
        $status = $request->input('status');

        try {
            Attendance::updateOrCreate(
                ['student_id' => $studentId, 'date' => $date],
                ['status' => $status]
            );

            // Return a proper Inertia response
            return back()->with([
                'toast' => [
                    'type' => 'success',
                    'message' => 'Attendance updated successfully',
                ]
            ]);
        } catch (\Exception $e) {
            return back()->with([
                'toast' => [
                    'type' => 'error',
                    'message' => 'Failed to update attendance',
                ]
            ]);
        }
    }

}
