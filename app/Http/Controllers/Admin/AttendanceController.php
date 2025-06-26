<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Carbon\Carbon;


class AttendanceController extends Controller
{

    public function index(Request $request)
    {
        // Parse date if provided (month-based filtering)
        $date = $request->date ? Carbon::parse($request->date . '-01') : null;

        // Fetch students with filtered branch/org/club and preload their attendances
        $students = Student::with([
            'attendances' => function ($q) use ($date) {
                if ($date) {
                    $q->whereMonth('date', $date->month)
                        ->whereYear('date', $date->year);
                }
            }
        ])
            ->when($request->branch_id, fn($q) => $q->where('branch_id', $request->branch_id))
            ->when($request->organization_id, fn($q) => $q->where('organization_id', $request->organization_id))
            ->when($request->club_id, fn($q) => $q->where('club_id', $request->club_id))
            ->get();

        // Map student + attendance into structured response
        $studentsWithAttendance = $students->map(function ($student) {
            $records = $student->attendances->groupBy(function ($a) {
                return \Carbon\Carbon::parse($a->date)->format('Y-m-d');
            })->map(fn($a) => $a->first()->status);

            return [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                ],
                'records' => $records,
            ];
        });

        // Send to Inertia
        return Inertia::render('Admin/Attendances/Index', [
            'studentsWithAttendance' => $studentsWithAttendance,
            'branches' => Branch::all(),
            'organizations' => Organization::all(),
            'clubs' => Club::all(),
            'filters' => $request->only('branch_id', 'organization_id', 'club_id', 'date'),
        ]);
    }


    // public function index(Request $request)
    // {
    //     $query = Attendance::with('student');

    //     if ($request->branch_id) {
    //         $query->whereHas('student', fn($q) => $q->where('branch_id', $request->branch_id));
    //     }
    //     if ($request->organization_id) {
    //         $query->whereHas('student', fn($q) => $q->where('organization_id', $request->organization_id));
    //     }
    //     if ($request->club_id) {
    //         $query->whereHas('student', fn($q) => $q->where('club_id', $request->club_id));
    //     }
    //     if ($request->date) {
    //         $query->whereDate('date', $request->date);
    //     }

    //     $attendances = $query->latest()->get();

    //     return Inertia::render('Admin/Attendances/Index', [
    //         'attendances' => $attendances,
    //         'branches' => Branch::all(),
    //         'organizations' => Organization::all(),
    //         'clubs' => Club::all(),
    //         'filters' => $request->only('branch_id', 'organization_id', 'club_id', 'date')
    //     ]);
    // }

    public function create()
    {
        return Inertia::render('Admin/Attendances/Create', [
            'branches' => Branch::all(),
            'organizations' => Organization::all(),
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

        return redirect()->route('admin.attendances.index')->with('success', 'Attendance recorded successfully.');
    }

    public function edit(Attendance $attendance)
    {
        return Inertia::render('Admin/Attendances/Edit', [
            'attendance' => $attendance->load('student'),
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $request->validate([
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);

        $attendance->update($request->only('status', 'remarks'));

        return redirect()->route('admin.attendances.index')->with('success', 'Attendance updated successfully.');
    }

    public function filter(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|integer',
            'organization_id' => 'required|integer',
            'club_id' => 'required|integer',
        ]);

        $students = Student::where('branch_id', $request->branch_id)
            ->where('organization_id', $request->organization_id)
            ->where('club_id', $request->club_id)
            ->get();

        return response()->json($students);
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->route('admin.attendances.index')->with('success', 'Attendance deleted successfully.');
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
