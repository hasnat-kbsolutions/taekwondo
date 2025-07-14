<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supporter;
use App\Models\Club;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SupporterController extends Controller
{
    public function index(Request $request)
    {
        $supporters = Supporter::query()
            ->when($request->organization_id, fn($q) => $q->where('organization_id', $request->organization_id))
            ->when($request->club_id, fn($q) => $q->where('club_id', $request->club_id))
            ->when($request->gender, fn($q) => $q->where('gender', $request->gender))
            ->when($request->status, fn($q) => $q->where('status', $request->status === 'active' ? 1 : 0))
            ->with(['club:id,name', 'organization:id,name'])
            ->get();

        return Inertia::render('Admin/Supporters/Index', [
            'supporters' => $supporters,
            'clubs' => Club::select('id', 'name')->get(),
            'organizations' => Organization::select('id', 'name')->get(),
            'filters' => $request->only(['organization_id', 'club_id', 'gender', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Supporters/Create', [
            'clubs' => Club::select('id', 'name')->get(),
            'organizations' => Organization::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'club_id' => 'required|integer|exists:clubs,id',
            'organization_id' => 'required|integer|exists:organizations,id',
            'name' => 'required|string|max:255',
            'surename' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'type' => 'required|string|max:50',
            'status' => 'nullable|boolean',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $validated['status'] = $request->boolean('status');

        if ($request->hasFile('profile_image')) {
            $validated['profile_image'] = $request->file('profile_image')->store('supporters', 'public');
        }

        try {
            Supporter::create($validated);
            return redirect()->route('admin.supporters.index')->with('success', 'Supporter created successfully');
        } catch (\Exception $e) {
            Log::error('Supporter creation failed: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Something went wrong.']);
        }
    }

    public function edit(Supporter $supporter)
    {
        return Inertia::render('Admin/Supporters/Edit', [
            'supporter' => $supporter,
            'clubs' => Club::select('id', 'name')->get(),
            'organizations' => Organization::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Supporter $supporter)
    {
        $validated = $request->validate([
            'club_id' => 'required|integer|exists:clubs,id',
            'organization_id' => 'required|integer|exists:organizations,id',
            'name' => 'required|string|max:255',
            'surename' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'type' => 'required|string|max:50',
            'status' => 'nullable|boolean',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $validated['status'] = $request->boolean('status');

        if ($request->hasFile('profile_image')) {
            if ($supporter->profile_image) {
                Storage::disk('public')->delete($supporter->profile_image);
            }

            $validated['profile_image'] = $request->file('profile_image')->store('supporters', 'public');
        }

        $supporter->update($validated);

        return redirect()->route('admin.supporters.index')->with('success', 'Supporter updated successfully');
    }

    public function destroy(Supporter $supporter)
    {
        if ($supporter->profile_image) {
            Storage::disk('public')->delete($supporter->profile_image);
        }

        $supporter->delete();

        return redirect()->route('admin.supporters.index')->with('success', 'Supporter deleted successfully');
    }
}
