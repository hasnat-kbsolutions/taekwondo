<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Organization;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
            ->get();

        $organizations = Organization::select('id', 'name')->get();
        $clubs = Club::select('id', 'name')->get();

        return Inertia::render('Admin/Instructors/Index', [
            'instructors' => $instructors,
            'organizations' => $organizations,
            'clubs' => $clubs,
            'filters' => $request->only(['organization_id', 'club_id']),
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/Instructors/Create', [
            'organizations' => Organization::all(),
            'clubs' => Club::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ic_number' => 'nullable|string|max:255',
            'email' => 'required|email|unique:instructors,email',
            'address' => 'nullable|string',
            'mobile' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'organization_id' => 'required|exists:organizations,id',
            'club_id' => 'required|exists:clubs,id',
        ]);

        // Upload profile picture
        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('instructors', 'public');
            $validated['profile_picture'] = '/storage/' . $path;
        }

        Instructor::create($validated);

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor created successfully');
    }

    public function edit(Instructor $instructor)
    {
        return Inertia::render('Admin/Instructors/Edit', [
            'instructor' => $instructor,
            'organizations' => Organization::all(),
            'clubs' => Club::all(),
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
