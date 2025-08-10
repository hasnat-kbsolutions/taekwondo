<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Organization;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class InstructorController extends Controller
{
    public function index(Request $request)
    {
        $query = Instructor::with(['organization', 'club'])->latest();

        $query->when(
            $request->filled('club_id') && $request->club_id !== 'all',
            fn($q) => $q->where('club_id', $request->club_id)
        );

        $instructors = $query->get()
            ->map(function ($instructor) {
                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'email' => $instructor->email,
                    'mobile' => $instructor->mobile,
                    'grade' => $instructor->grade,
                    'gender' => $instructor->gender,
                    'organization' => $instructor->organization,
                    'club' => $instructor->club,
                    'average_rating' => $instructor->average_rating,
                    'total_ratings' => $instructor->total_ratings,
                ];
            });

        return Inertia::render('Organization/Instructors/Index', [
            'instructors' => $instructors,
            'clubs' => Club::select('id', 'name')
                ->when(Auth::user()->role === 'organization', function ($query) {
                    $query->where('organization_id', Auth::user()->userable_id);
                })
                ->get(),
            'filters' => $request->only(['club_id']),
        ]);
    }


    public function create(Request $request)
    {
        $orgId = Auth::user()->userable_id;
        $clubId = $request->input('club_id');
        $students = collect();
        if ($clubId) {
            $students = Student::where('organization_id', $orgId)
                ->where('club_id', $clubId)
                ->get();
        }
        return Inertia::render('Organization/Instructors/Create', [
            'clubs' => Club::where('organization_id', $orgId)->get(),
            'students' => $students,
            'selected_club_id' => $clubId,
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
            'gender' => 'nullable|in:male,female,other',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'club_id' => 'nullable|exists:clubs,id',
            'student_ids' => 'array',
            'student_ids.*' => 'exists:students,id',
            'password' => 'required|string|min:6',
        ]);
        if (Auth::user()->role === 'organization') {
            $validated['organization_id'] = Auth::user()->userable_id;
        }
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
        return redirect()->route('organization.instructors.index')
            ->with('success', 'Instructor created successfully');
    }

    public function edit(Instructor $instructor, Request $request)
    {
        $orgId = Auth::user()->userable_id;
        $clubId = $request->input('club_id', $instructor->club_id);
        $students = collect();
        if ($clubId) {
            $students = Student::where('organization_id', $orgId)
                ->where('club_id', $clubId)
                ->get();
        }
        return Inertia::render('Organization/Instructors/Edit', [
            'instructor' => $instructor->load('students'),
            'clubs' => Club::where('organization_id', $orgId)->get(),
            'students' => $students,
            'selected_student_ids' => $instructor->students->pluck('id'),
            'selected_club_id' => $clubId,
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
            'gender' => 'nullable|in:male,female,other',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'club_id' => 'nullable|exists:clubs,id',
            'student_ids' => 'array',
            'student_ids.*' => 'exists:students,id',
        ]);
        if (Auth::user()->role === 'organization') {
            $validated['organization_id'] = Auth::user()->userable_id;
        }
        if ($request->hasFile('profile_picture')) {
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
        return redirect()->route('organization.instructors.index')
            ->with('success', 'Instructor updated successfully');
    }

    public function destroy(Instructor $instructor)
    {
        if ($instructor->profile_picture) {
            $oldPath = str_replace('/storage/', '', parse_url($instructor->profile_picture, PHP_URL_PATH));
            Storage::disk('public')->delete($oldPath);
        }

        $instructor->delete();

        return redirect()->route('organization.instructors.index')
            ->with('success', 'Instructor deleted successfully');
    }
}