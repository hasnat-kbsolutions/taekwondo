<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $instructor = Auth::user()->userable;
        $students = $instructor->students()->get();
        return Inertia::render('Instructor/Students/Index', [
            'students' => $students,
        ]);
    }

    public function edit($id)
    {
        $instructor = Auth::user()->userable;
        $student = $instructor->students()->findOrFail($id);
        return Inertia::render('Instructor/Students/Edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, $id)
    {
        $instructor = Auth::user()->userable;
        $student = $instructor->students()->findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'grade' => 'nullable|string',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string',
            'nationality' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'nullable|boolean',
        ]);
        $student->update($validated);
        return redirect()->route('instructor.students.index')->with('success', 'Student updated successfully');
    }
}