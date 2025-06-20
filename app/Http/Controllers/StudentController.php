<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\Club;
class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::when($request->organization_id, function ($query) use ($request) {
            $query->where('organization_id', $request->organization_id);
        })->get();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'organizationId' => $request->organization_id,
        ]);
    }


    public function create()
    {

        $branches = Branch::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();
        $clubs = Club::select('id', 'name')->get();

        return Inertia::render('Students/Create', [
            'branches' => $branches,
            'organizations' => $organizations,
            'clubs' => $clubs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'nullable|integer',
            'organization_id' => 'nullable|integer',
            'club_id' => 'nullable|integer',
            'uid' => 'nullable|string',
            'code' => 'nullable|string',
            'name' => 'required|string',
            'surname' => 'nullable|string',
            'nationality' => 'nullable|string',
            'dob' => 'nullable|date',
            'dod' => 'nullable|date',
            'grade' => 'nullable|string',
            'gender' => 'nullable|string',
            'id_passport' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'id_passport_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'signature_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'skype' => 'nullable|string',
            'website' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'nullable|boolean',
        ]);

        foreach (['profile_image', 'id_passport_image', 'signature_image'] as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store("students", "public");
            }
        }

        Student::create($validated);

        return redirect()->route('students.index')->with('success', 'Student created successfully');
    }

    public function edit(Student $student)
    {

        $branches = Branch::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();
        $clubs = Club::select('id', 'name')->get();

        return Inertia::render('Students/Edit', [
            'student' => $student,
            'branches' => $branches,
            'organizations' => $organizations,
            'clubs' => $clubs,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'branch_id' => 'nullable|integer',
            'organization_id' => 'nullable|integer',
            'club_id' => 'nullable|integer',
            'uid' => 'nullable|string',
            'code' => 'nullable|string',
            'name' => 'required|string',
            'surname' => 'nullable|string',
            'nationality' => 'nullable|string',
            'dob' => 'nullable|date',
            'dod' => 'nullable|date',
            'grade' => 'nullable|string',
            'gender' => 'nullable|string',
            'id_passport' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'id_passport_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'signature_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'skype' => 'nullable|string',
            'website' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'nullable|boolean',
        ]);

        foreach (['profile_image', 'id_passport_image', 'signature_image'] as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store("students", "public");
            }
        }

        $student->update($validated);

        return redirect()->route('students.index')->with('success', 'Student updated successfully');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('students.index')->with('success', 'Student deleted');
    }
}

