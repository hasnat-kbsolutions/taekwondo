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

class InstructorController extends Controller
{
    public function index(Request $request)
    {
        $query = Instructor::with(['organization', 'club'])->latest();

        $query->when(
            $request->filled('club_id') && $request->club_id !== 'all',
            fn($q) => $q->where('club_id', $request->club_id)
        );

        $instructors = $query->get();

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


    public function create()
    {
        return Inertia::render('Organization/Instructors/Create', [
            'clubs' => Club::select('id', 'name')
                ->when(Auth::user()->role === 'organization', function ($query) {
                    $query->where('organization_id', Auth::user()->userable_id);
                })
                ->get(),
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
            'club_id' => 'nullable|exists:clubs,id',
        ]);

        // Force organization_id if user is organization
        if (Auth::user()->role === 'organization') {
            $validated['organization_id'] = Auth::user()->userable_id;
        }

        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('instructors', 'public');
            $validated['profile_picture'] = '/storage/' . $path;
        }

        Instructor::create($validated);

        return redirect()->route('organization.instructors.index')
            ->with('success', 'Instructor created successfully');
    }

    public function edit(Instructor $instructor)
    {
        return Inertia::render('Organization/Instructors/Edit', [
            'instructor' => $instructor,
            'clubs' => Club::select('id', 'name')
                ->when(Auth::user()->role === 'organization', function ($query) {
                    $query->where('organization_id', Auth::user()->userable_id);
                })
                ->get(),
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
            'club_id' => 'nullable|exists:clubs,id',
        ]);

        // Force organization_id if user is organization
        if (Auth::user()->role === 'organization') {
            $validated['organization_id'] = Auth::user()->userable_id;
        }

        if ($request->hasFile('profile_picture')) {
            // Delete old picture
            if ($instructor->profile_picture) {
                $oldPath = str_replace('/storage/', '', parse_url($instructor->profile_picture, PHP_URL_PATH));
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('profile_picture')->store('instructors', 'public');
            $validated['profile_picture'] = '/storage/' . $path;
        }

        $instructor->update($validated);

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