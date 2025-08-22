<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date . '-01') : null;
        $instructor = Auth::user()->userable;

        $query = Student::with([
            'attendances' => function ($q) use ($date) {
                if ($date) {
                    $q->whereMonth('date', $date->month)
                        ->whereYear('date', $date->year);
                }
            }
        ]);

        // Get students assigned to this instructor
        $query->whereHas('instructors', function ($q) use ($instructor) {
            $q->where('instructor_id', $instructor->id);
        });

        // Also filter by club and organization if instructor has them
        if ($instructor->club_id) {
            $query->where('club_id', $instructor->club_id);
        }
        if ($instructor->organization_id) {
            $query->where('organization_id', $instructor->organization_id);
        }

        $students = $query->get();

        $studentsWithAttendance = $students->map(function ($student) {
            $records = $student->attendances->groupBy(
                fn($a) => Carbon::parse($a->date)->format('Y-m-d')
            )->map(fn($a) => $a->first()->status);

            return [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'surname' => $student->surname,
                ],
                'records' => $records,
            ];
        });

        return Inertia::render('Instructor/Attendances/Index', [
            'studentsWithAttendance' => $studentsWithAttendance,
            'filters' => $request->only('date'),
        ]);
    }

    public function create()
    {
        $instructor = Auth::user()->userable;

        $students = Student::whereHas('instructors', function ($q) use ($instructor) {
            $q->where('instructor_id', $instructor->id);
        })->get(['id', 'name', 'surname']);

        return Inertia::render('Instructor/Attendances/Create', [
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
        ]);

        $instructor = Auth::user()->userable;

        foreach ($request->attendances as $studentId => $attendance) {
            // Verify the student is assigned to this instructor
            $student = Student::whereHas('instructors', function ($q) use ($instructor) {
                $q->where('instructor_id', $instructor->id);
            })->where('id', $studentId)->first();

            if ($student) {
                Attendance::create([
                    'student_id' => $studentId,
                    'date' => $request->date,
                    'status' => $attendance['status'],
                    'remarks' => $attendance['remarks'] ?? null,
                ]);
            }
        }

        return redirect()->route('instructor.attendances.index')->with('success', 'Attendance recorded successfully.');
    }

    public function edit($id)
    {
        $instructor = Auth::user()->userable;

        $attendance = Attendance::with('student')
            ->where('id', $id)
            ->whereHas('student.instructors', function ($q) use ($instructor) {
                $q->where('instructor_id', $instructor->id);
            })
            ->firstOrFail();

        return Inertia::render('Instructor/Attendances/Edit', [
            'attendance' => $attendance,
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $request->validate([
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);

        $instructor = Auth::user()->userable;

        // Verify the attendance belongs to a student assigned to this instructor
        $student = Student::whereHas('instructors', function ($q) use ($instructor) {
            $q->where('instructor_id', $instructor->id);
        })->where('id', $attendance->student_id)->first();

        if (!$student) {
            abort(403, 'Unauthorized');
        }

        $attendance->update($request->only('status', 'remarks'));

        return redirect()->route('instructor.attendances.index')->with('success', 'Attendance updated successfully.');
    }

    public function destroy(Attendance $attendance)
    {
        $instructor = Auth::user()->userable;

        // Verify the attendance belongs to a student assigned to this instructor
        $student = Student::whereHas('instructors', function ($q) use ($instructor) {
            $q->where('instructor_id', $instructor->id);
        })->where('id', $attendance->student_id)->first();

        if (!$student) {
            abort(403, 'Unauthorized');
        }

        $attendance->delete();
        return redirect()->route('instructor.attendances.index')->with('success', 'Attendance deleted successfully.');
    }

    public function toggle(Request $request)
    {
        $studentId = $request->input('student_id');
        $date = $request->input('date');
        $status = $request->input('status');
        $instructor = Auth::user()->userable;

        // Verify the student is assigned to this instructor
        $student = Student::whereHas('instructors', function ($q) use ($instructor) {
            $q->where('instructor_id', $instructor->id);
        })->where('id', $studentId)->first();

        if (!$student) {
            return back()->with([
                'toast' => [
                    'type' => 'error',
                    'message' => 'Unauthorized to modify this student\'s attendance',
                ]
            ]);
        }

        try {
            Attendance::updateOrCreate(
                ['student_id' => $studentId, 'date' => $date],
                ['status' => $status]
            );

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
