<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Club;
use App\Models\Student;
use App\Models\Supporter;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class OrganizationController extends Controller
{
    public function index()
    {
        $organizations = Organization::with(['students', 'supporters'])->get();

        return Inertia::render('Admin/Organizations/Index', [
            'organizations' => $organizations,
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/Organizations/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'skype' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'status' => 'boolean',
        ]);

        $organization = Organization::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'skype' => $validated['skype'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'status' => $validated['status'] ?? false,
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make('password'),
            'role' => 'organization',
            'userable_type' => Organization::class,
            'userable_id' => $organization->id,
        ]);

        return redirect()->route('admin.organizations.index')->with('success', 'Organization created successfully');
    }

    public function edit(Organization $organization)
    {
        return Inertia::render('Admin/Organizations/Edit', [
            'organization' => $organization,
        ]);
    }

    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . optional($organization->user)->id,
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'skype' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'status' => 'boolean',
        ]);

        $organization->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'skype' => $validated['skype'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'status' => $validated['status'] ?? false,
        ]);

        if ($organization->user) {
            $organization->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);
        }

        return redirect()->route('admin.organizations.index')->with('success', 'Organization updated successfully');
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();

        return redirect()->route('admin.organizations.index')->with('success', 'Organization deleted successfully');
    }
}
