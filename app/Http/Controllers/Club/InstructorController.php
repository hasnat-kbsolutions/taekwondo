<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Organization;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class InstructorController extends Controller
{
    public function index(Request $request)
    {

        $instructors = Instructor::query()
            ->when(Auth::user()->role === 'club', function ($query) {
                $query->where('organization_id', Auth::user()->userable->organization_id);
                $query->where('club_id', Auth::user()->userable_id);
            })
            ->when($request->organization_id, function ($query) use ($request) {
                $query->where('organization_id', $request->organization_id);
            })
            ->latest()->get()
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


        return Inertia::render('Club/Instructors/Index', [
            'instructors' => $instructors,
            'filters' => $request->only(['organization_id', 'club_id']),
        ]);
    }


    public function create(Request $request)
    {
        $clubId = Auth::user()->userable_id;
        $students = Student::where('club_id', $clubId)->get();
        return Inertia::render('Club/Instructors/Create', [
            'students' => $students,
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
            'student_ids' => 'array',
            'student_ids.*' => 'exists:students,id',
            'password' => 'required|string|min:6',
        ]);
        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('instructors', 'public');
            $validated['profile_picture'] = '/storage/' . $path;
        }
        if (Auth::user()->role === 'club') {
            $validated['club_id'] = Auth::user()->userable_id;
            $validated['organization_id'] = Auth::user()->userable->organization_id;
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
        return redirect()->route('club.instructors.index')
            ->with('success', 'Instructor created successfully');
    }

    public function edit(Instructor $instructor)
    {
        $clubId = Auth::user()->userable_id;
        $students = Student::where('club_id', $clubId)->get();
        return Inertia::render('Club/Instructors/Edit', [
            'instructor' => $instructor->load('students'),
            'students' => $students,
            'selected_student_ids' => $instructor->students->pluck('id'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ic_number' => 'nullable|string|max:255',
            'email' => 'required|email|unique:instructors,email,' . $instructor->id,
            'address' => 'nullable|string',
            'mobile' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'student_ids' => 'array',
            'student_ids.*' => 'exists:students,id',
        ]);
        if (!$request->hasFile('profile_picture')) {
            unset($validated['profile_picture']);
        } else {
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
        return redirect()->route('club.instructors.index')
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

        return redirect()->route('club.instructors.index')
            ->with('success', 'Instructor deleted successfully');
    }
}