<?php

namespace App\Http\Controllers\Club;
use App\Http\Controllers\Controller;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Club;
use App\Models\Organization;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
class StudentController extends Controller
{
    public function index(Request $request)
    {

        $students = Student::query()
            ->when(Auth::user()->role === 'club', function ($query) {
                $query->where('organization_id', Auth::user()->userable->organization_id);
                $query->where('club_id', Auth::user()->userable_id);
            })
            ->when($request->organization_id, function ($query) use ($request) {
                $query->where('organization_id', $request->organization_id);
            })
            ->latest()->get();

        return Inertia::render('Club/Students/Index', [
            'students' => $students,
            'organizationId' => $request->organization_id,
        ]);
    }


    public function create()
    {

        $clubs = Club::select('id', 'name')->get();
        // $organizations = Organization::select('id', 'name')->get();


        return Inertia::render('Club/Students/Create', [
            'clubs' => $clubs,
            // 'organizations' => $organizations,

        ]);
    }

    public function store(Request $request)
    {
        // Validate required fields
        $validated = $request->validate([

            // Required fields
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'password' => 'required|string|min:6',
            'dob' => 'required|date',
            'gender' => 'required|string',
            'nationality' => 'required|string',
            'grade' => 'required|string',
            'id_passport' => 'required|string',

            // Optional fields
            'surname' => 'nullable|string',
            'dod' => 'nullable|date',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'id_passport_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'signature_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'skype' => 'nullable|string',
            'website' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
        ]);



        $validated['uid'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        $validated['code'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));


        // Inject organization_id if the logged-in user is an organization
        if (Auth::user()->role === 'club') {
            $validated['club_id'] = Auth::user()->userable_id;
            $validated['organization_id'] = Auth::user()->userable->organization_id;
        }

        // Upload images if present
        foreach (['profile_image', 'id_passport_image', 'signature_image'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $validated[$field] = asset("storage/" . $relativePath); // Full URL with ASSET_URL
            }
        }

        // Create student profile
        $student = Student::create($validated);

        // Create user only if email is provided
        if (!empty($validated['email'])) {
            $student->user()->create([
                'name' => $validated['name'] . ' ' . ($validated['surname'] ?? ''),
                'email' => $validated['email'],
                'password' => Hash::make($request->password),
                'role' => 'student',
            ]);
        }

        return redirect()->route('club.students.index')->with('success', 'Student created successfully');
    }

    public function edit(Student $student)
    {

 


        return Inertia::render('Club/Students/Edit', [
            'student' => $student,
       

        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([

            // Required fields
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'dob' => 'required|date',
            'gender' => 'required|string',
            'nationality' => 'required|string',
            'grade' => 'required|string',
            'id_passport' => 'required|string',

            // Password is optional
            'password' => 'nullable|string|min:6',

            // Optional fields
            'surname' => 'nullable|string',
            'dod' => 'nullable|date',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'id_passport_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'signature_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'skype' => 'nullable|string',
            'website' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        // Handle image uploads
        foreach (['profile_image', 'id_passport_image', 'signature_image'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $validated[$field] = "/storage/" . $relativePath;
            } else {
                // Remove from validated to prevent overwriting existing image with null
                unset($validated[$field]);
            }
        }

        // Update the student record
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

            // Only include password if it's provided
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            User::updateOrCreate(
                ['email' => $validated['email']],
                $userData
            );
        }

        return redirect()
            ->route('club.students.index')
            ->with('success', 'Student updated successfully');
    }

    public function destroy(Student $student)
    {
        // Delete related user if exists
        if ($student->user) {
            $student->user->delete();
        }

        if ($student->profile_image) {
            Storage::disk('public')->delete($student->profile_image);
        }
        if ($student->id_passport_image) {
            Storage::disk('public')->delete($student->id_passport_image);
        }
        if ($student->signature_image) {
            Storage::disk('public')->delete($student->signature_image);
        }

        // Then delete the student
        $student->delete();

        return redirect()->route('club.students.index')->with('success', 'Student and associated user deleted');
    }
}

