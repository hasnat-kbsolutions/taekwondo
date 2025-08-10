<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Organization;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class InstructorController extends Controller
{
    public function index(Request $request)
    {
        $instructors = Instructor::with(['organization', 'club'])
            ->when(
                $request->filled('organization_id') && $request->organization_id !== 'all',
                fn($q) => $q->where('organization_id', $request->organization_id)
            )
            ->when(
                $request->filled('club_id') && $request->club_id !== 'all',
                fn($q) => $q->where('club_id', $request->club_id)
            )
            ->latest()
            ->get()
            ->map(function ($instructor) {
                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'email' => $instructor->email,
                    'mobile' => $instructor->mobile,
                    'grade' => $instructor->grade,
                    'organization' => $instructor->organization,
                    'club' => $instructor->club,
                    'average_rating' => $instructor->average_rating,
                    'total_ratings' => $instructor->total_ratings,
                ];
            });

        $organizations = Organization::select('id', 'name')->get();
        $clubs = Club::select('id', 'name')->get();

        return Inertia::render('Admin/Instructors/Index', [
            'instructors' => $instructors,
            'organizations' => $organizations,
            'clubs' => $clubs,
            'filters' => $request->only(['organization_id', 'club_id']),
        ]);
    }


    public function create(Request $request)
    {
        $selected_organization_id = $request->input('organization_id');
        $selected_club_id = $request->input('club_id');
        $students = collect();
        if ($selected_organization_id && $selected_club_id) {
            $students = \App\Models\Student::where('organization_id', $selected_organization_id)
                ->where('club_id', $selected_club_id)
                ->get();
        }
        return Inertia::render('Admin/Instructors/Create', [
            'organizations' => Organization::all(),
            'clubs' => Club::all(),
            'students' => $students,
            'selected_organization_id' => $selected_organization_id,
            'selected_club_id' => $selected_club_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ic_number' => 'nullable|string|max:255',
            'email' => 'required|email|unique:instructors,email|unique:users,email',
            'address' => 'nullable|string',
            'mobile' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'organization_id' => 'required|exists:organizations,id',
            'club_id' => 'required|exists:clubs,id',
            'student_ids' => 'array',
            'student_ids.*' => 'exists:students,id',
            'password' => 'required|string|min:6',
        ]);
        // Upload profile picture
        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('instructors', 'public');
            $validated['profile_picture'] = '/storage/' . $path;
        }
        $instructor = Instructor::create($validated);
        if ($request->has('student_ids')) {
            $instructor->students()->sync($request->student_ids);
        }
        // Create user for instructor
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'instructor',
            'userable_type' => Instructor::class,
            'userable_id' => $instructor->id,
        ]);
        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor created successfully');
    }

    public function edit(Instructor $instructor, Request $request)
    {
        $selected_organization_id = $request->input('organization_id', $instructor->organization_id);
        $selected_club_id = $request->input('club_id', $instructor->club_id);
        $students = collect();
        if ($selected_organization_id && $selected_club_id) {
            $students = \App\Models\Student::where('organization_id', $selected_organization_id)
                ->where('club_id', $selected_club_id)
                ->get();
        }
        return Inertia::render('Admin/Instructors/Edit', [
            'instructor' => $instructor->load('students'),
            'organizations' => Organization::all(),
            'clubs' => Club::all(),
            'students' => $students,
            'selected_student_ids' => $instructor->students->pluck('id'),
            'selected_organization_id' => $selected_organization_id,
            'selected_club_id' => $selected_club_id,
        ]);
    }

    public function update(Request $request, Instructor $instructor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ic_number' => 'nullable|string|max:255',
            'email' => 'required|email|unique:instructors,email,' . $instructor->id,
            'address' => 'nullable|string',
            'mobile' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'organization_id' => 'required|exists:organizations,id',
            'club_id' => 'required|exists:clubs,id',
            'student_ids' => 'array',
            'student_ids.*' => 'exists:students,id',
        ]);

        // Replace profile picture if a new one is uploaded
        if ($request->hasFile('profile_picture')) {
            // Delete old picture if it exists
            if ($instructor->profile_picture) {
                $oldPath = str_replace('/storage/', '', parse_url($instructor->profile_picture, PHP_URL_PATH));
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('profile_picture')->store('instructors', 'public');
            $validated['profile_picture'] = '/storage/' . $path;
        }

        $instructor->update($validated);
        if ($request->has('student_ids')) {
            $instructor->students()->sync($request->student_ids);
        }

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor updated successfully');
    }

    public function destroy(Instructor $instructor)
    {
        // Optional: Delete profile picture from disk
        if ($instructor->profile_picture) {
            $oldPath = str_replace('/storage/', '', parse_url($instructor->profile_picture, PHP_URL_PATH));
            Storage::disk('public')->delete($oldPath);
        }

        $instructor->delete();

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor deleted successfully');
    }
}
