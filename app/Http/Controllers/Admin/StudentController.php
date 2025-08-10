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
use Illuminate\Support\Facades\Storage;
use App\Exports\StudentExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::query()
            ->with(['organization', 'club']) // eager load relations
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
                ];
            });

        return Inertia::render('Admin/Students/Index', [
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

        $clubs = Club::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();

        return Inertia::render('Admin/Students/Create', [
            'clubs' => $clubs,
            'organizations' => $organizations,
        ]);
    }

    public function store(Request $request)
    {
        // Validate required fields
        $validated = $request->validate([
            'club_id' => 'required|integer',
            'organization_id' => 'required|integer',

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
            'website' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
        ]);




        // Generate UID
        $validated['uid'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        $validated['code'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

        // Upload files if present
        foreach (['profile_image', 'id_passport_image', 'signature_image'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $validated[$field] = asset("storage/" . $relativePath); // Full URL (uses ASSET_URL if set)
            }
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
            'club_id' => 'required|integer',
            'organization_id' => 'required|integer',

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
            ->route('admin.students.index')
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

        return redirect()->route('admin.students.index')->with('success', 'Student and associated user deleted');
    }


    public function export()
    {
        return Excel::download(new StudentExport, 'students.xlsx');
    }

}

