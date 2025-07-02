<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Club;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::when($request->organization_id, function ($query) use ($request) {
            $query->where('organization_id', $request->organization_id);
        })->latest()->get();

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'organizationId' => $request->organization_id,
        ]);
    }


    public function create()
    {

        $clubs = Club::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();

        return Inertia::render('Admin/Students/Create', [
            'clubs' => $clubs,
            'organizations' => $organizations,
        ]);
    }

    public function store(Request $request)
    {
        // Skip validation for now
        $data = $request->all();

        // Generate UID and add to $data
        $data['uid'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));


        // Upload images if present
        foreach (['profile_image', 'id_passport_image', 'signature_image'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $data[$field] = asset("storage/" . $relativePath); // Full URL with ASSET_URL
            }
        }

        // Create student profile
        $student = Student::create($data);

        // Create user only if email is provided
        if (!empty($data['email'])) {
            $student->user()->create([
                'name' => $data['name'] . ' ' . ($data['surname'] ?? ''),
                'email' => $data['email'],
                'password' => Hash::make($request->password),
                'role' => 'student',
            ]);
        }

        return redirect()->route('admin.students.index')->with('success', 'Student created successfully');
    }

    public function edit(Student $student)
    {

        $clubs = Club::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();

        return Inertia::render('Admin/Students/Edit', [
            'student' => $student,
            'clubs' => $clubs,
            'organizations' => $organizations,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'club_id' => 'nullable|integer',
            'organization_id' => 'nullable|integer',
            'uid' => 'nullable|string',
            'code' => 'nullable|string',
            'name' => 'required|string',
            'password' => 'nullable|string|min:6',
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

        // Handle image uploads
        foreach (['profile_image', 'id_passport_image', 'signature_image'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $validated[$field] = "/storage/" . $relativePath;
            }
        }

        // Update the student
        $student->update($validated);

        // Create or update user account
        if (!empty($validated['email'])) {
            $userData = [
                'name' => $validated['name'] . ' ' . ($validated['surname'] ?? ''),
                'role' => 'student',
                'organization_id' => $validated['organization_id'] ?? null,
                'club_id' => $validated['club_id'] ?? null,
                'student_id' => $student->id,
            ];

            // Only include password if present in the request
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            User::updateOrCreate(
                ['email' => $validated['email']],
                $userData
            );
        }

        return redirect()->route('admin.students.index')->with('success', 'Student updated successfully');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('admin.students.index')->with('success', 'Student deleted');
    }
}

