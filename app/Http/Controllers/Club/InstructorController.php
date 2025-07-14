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
            ->latest()->get();


        return Inertia::render('Club/Instructors/Index', [
            'instructors' => $instructors,
            'filters' => $request->only(['organization_id', 'club_id']),
        ]);
    }


    public function create()
    {
        return Inertia::render('Club/Instructors/Create');
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
        ]);

        // Upload profile picture
        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('instructors', 'public');
            $validated['profile_picture'] = '/storage/' . $path;
        }
        // Inject organization_id if the logged-in user is an organization
        if (Auth::user()->role === 'club') {
            $validated['club_id'] = Auth::user()->userable_id;
            $validated['organization_id'] = Auth::user()->userable->organization_id;
        }
        
        Instructor::create($validated);

        return redirect()->route('club.instructors.index')
            ->with('success', 'Instructor created successfully');
    }

    public function edit(Instructor $instructor)
    {
        return Inertia::render('Club/Instructors/Edit', [
            'instructor' => $instructor,
        ]);
    }

    public function update(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ic_number' => 'nullable|string|max:255',
            'email' => 'required|email|unique:instructors,email,' . $instructor->id,
            'address' => 'nullable|string',
            'mobile' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Remove profile_picture from validated data if no file is uploaded
        if (!$request->hasFile('profile_picture')) {
            unset($validated['profile_picture']);
        } else {
            // Delete old picture if it exists
            if ($instructor->profile_picture) {
                $oldPath = str_replace('/storage/', '', parse_url($instructor->profile_picture, PHP_URL_PATH));
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('profile_picture')->store('instructors', 'public');
            $validated['profile_picture'] = '/storage/' . $path;
        }

        // Update the instructor
        $instructor->update($validated);

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