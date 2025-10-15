<?php

namespace App\Http\Controllers\Organization;
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
            ->with(['organization', 'club']) // eager load relations
            ->when(Auth::user()->role === 'organization', function ($query) {
                $query->where('organization_id', Auth::user()->userable_id);
            })
            ->when($request->filled('organization_id') && $request->organization_id !== 'all', function ($query) use ($request) {
                $query->where('organization_id', $request->organization_id);
            })
            ->when($request->filled('club_id') && $request->club_id !== 'all', function ($query) use ($request) {
                $query->where('club_id', $request->club_id);
            })
            ->when($request->filled('nationality') && $request->nationality !== 'all', function ($query) use ($request) {
                $query->where('nationality', $request->nationality);
            })
            ->when($request->filled('country') && $request->country !== 'all', function ($query) use ($request) {
                $query->where('country', $request->country);
            })
            ->when($request->filled('status') && $request->status !== 'all', function ($query) use ($request) {
                $query->where('status', $request->status === 'active' ? true : false);
            })
            ->latest()
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'uid' => $student->uid,
                    'code' => $student->code,
                    'name' => $student->name,
                    'surname' => $student->surname,
                    'email' => $student->email,
                    'phone' => $student->phone,
                    'grade' => $student->grade,
                    'gender' => $student->gender,
                    'nationality' => $student->nationality,
                    'country' => $student->country,
                    'status' => $student->status,
                    'organization' => $student->organization,
                    'club' => $student->club,
                    'average_rating' => $student->average_rating,
                    'total_ratings' => $student->total_ratings,
                    'profile_image' => $student->profile_image,
                    'identification_document' => $student->identification_document,
                    'dob' => $student->dob,
                    'dod' => $student->dod,
                    'id_passport' => $student->id_passport,
                    'city' => $student->city,
                    'postal_code' => $student->postal_code,
                    'street' => $student->street,
                ];
            });

        return Inertia::render('Organization/Students/Index', [
            'students' => $students,
            'organizations' => Organization::select('id', 'name')->get(),
            'clubs' => Club::select('id', 'name')->get(),
            'nationalities' => Student::select('nationality')->distinct()->pluck('nationality'),
            'countries' => Student::select('country')->distinct()->pluck('country'),
            'filters' => [
                'organization_id' => $request->organization_id,
                'club_id' => $request->club_id,
                'nationality' => $request->nationality,
                'country' => $request->country,
                'status' => $request->status,
            ],
        ]);
    }


    public function create()
    {
        $user = Auth::user();

        $clubs = Club::where('organization_id', $user->userable_id)
            ->select('id', 'name')
            ->get();

        return Inertia::render('Organization/Students/Create', [
            'clubs' => $clubs,
        ]);
    }


    public function store(Request $request)
    {
        // Validate required fields
        $validated = $request->validate([
            'club_id' => 'required|integer',
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'phone' => 'required|string',
            'surname' => 'nullable|string',
            'nationality' => 'required|string',
            'dob' => 'required|date',
            'dod' => 'nullable|date',
            'grade' => 'required|string',
            'gender' => 'required|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'identification_document' => 'nullable|mimes:pdf|max:2048',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        // Generate UID
        $validated['uid'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        $validated['code'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

        // Handle image uploads
        foreach (['profile_image', 'identification_document'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $validated[$field] = $relativePath; // Store relative path only
            } else {
                // Remove from validated to prevent overwriting existing file with null
                unset($validated[$field]);
            }
        }

        // Inject organization_id if the logged-in user is an organization
        if (Auth::user()->role === 'organization') {
            $validated['organization_id'] = Auth::user()->userable_id;
        }

        // Create student
        $student = Student::create($validated);

        // Create linked user (if email provided)
        if (!empty($validated['email'])) {
            $student->user()->create([
                'name' => trim($validated['name'] . ' ' . ($validated['surname'] ?? '')),
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'student',
            ]);
        }

        return redirect()->route('organization.students.index')->with('success', 'Student created successfully');


    }

    public function edit(Student $student)
    {

        $user = Auth::user();

        $clubs = Club::where('organization_id', $user->userable_id)
            ->select('id', 'name')
            ->get();


        return Inertia::render('Organization/Students/Edit', [
            'student' => $student,
            'clubs' => $clubs,
            // 'organizations' => $organizations,

        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'club_id' => 'required|integer',
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'nullable|string|min:6',

            'phone' => 'required|string',
            'surname' => 'nullable|string',
            'nationality' => 'required|string',
            'dob' => 'required|date',
            'dod' => 'nullable|date',
            'grade' => 'required|string',
            'gender' => 'required|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'identification_document' => 'nullable|mimes:pdf|max:2048',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        // Handle image uploads
        foreach (['profile_image', 'identification_document'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $validated[$field] = $relativePath; // Store relative path only
            } else {
                // Remove from validated to prevent overwriting existing file with null
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
            ->route('organization.students.index')
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
        if ($student->identification_document) {
            Storage::disk('public')->delete($student->identification_document);
        }

        // Then delete the student
        $student->delete();

        return redirect()->route('organization.students.index')->with('success', 'Student and associated user deleted');
    }

    public function updatePassword(Request $request, Student $student)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Update the user's password if the student has a linked user
        $user = User::where('email', $student->email)->first();

        if ($user) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);

            return redirect()->route('organization.students.index')->with('success', 'Password updated successfully');
        }

        return redirect()->route('organization.students.index')->with('error', 'No user account found for this student');
    }
}

