<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Company;
use App\Models\Organization;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with('student');

        if ($request->company_id) {
            $query->whereHas('student', fn($q) => $q->where('company_id', $request->company_id));
        }
        if ($request->organization_id) {
            $query->whereHas('student', fn($q) => $q->where('organization_id', $request->organization_id));
        }
        if ($request->club_id) {
            $query->whereHas('student', fn($q) => $q->where('club_id', $request->club_id));
        }
        if ($request->date) {
            $query->whereDate('date', $request->date);
        }

        $attendances = $query->latest()->get();

        return Inertia::render('Attendances/Index', [
            'attendances' => $attendances,
            'companies' => Company::all(),
            'organizations' => Organization::all(),
            'clubs' => Club::all(),
            'filters' => $request->only('company_id', 'organization_id', 'club_id', 'date')
        ]);
    }

    public function create()
    {
        return Inertia::render('Attendances/Create', [
            'companies' => Company::all(),
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

        return redirect()->route('attendances.index')->with('success', 'Attendance recorded successfully.');
    }

    public function edit(Attendance $attendance)
    {
        return Inertia::render('Attendances/Edit', [
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

        return redirect()->route('attendances.index')->with('success', 'Attendance updated successfully.');
    }

    public function filter(Request $request)
    {
        $request->validate([
            'company_id' => 'required|integer',
            'organization_id' => 'required|integer',
            'club_id' => 'required|integer',
        ]);

        $students = Student::where('company_id', $request->company_id)
            ->where('organization_id', $request->organization_id)
            ->where('club_id', $request->club_id)
            ->get();

        return response()->json($students);
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->route('attendances.index')->with('success', 'Attendance deleted successfully.');
    }
}
