<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Organization;
use App\Models\Currency;
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
        $organizations = Organization::with(['students', 'supporters', 'clubs', 'instructors'])->get();

        return Inertia::render('Admin/Organizations/Index', [
            'organizations' => $organizations,
        ]);
    }


    public function create()
    {
        $currencies = Currency::where('is_active', true)->get();

        return Inertia::render('Admin/Organizations/Create', [
            'currencies' => $currencies,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',

            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'status' => 'boolean',
            'default_currency' => 'required|string|exists:currencies,code',
        ]);


        $organization = Organization::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'status' => $validated['status'] ?? false,
            'default_currency' => $validated['default_currency'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'organization',
            'userable_type' => Organization::class,
            'userable_id' => $organization->id,
        ]);

        return redirect()
            ->route('admin.organizations.index')
            ->with('success', 'Organization created successfully');
    }

    public function edit(Organization $organization)
    {
        $currencies = Currency::where('is_active', true)->get();

        return Inertia::render('Admin/Organizations/Edit', [
            'organization' => $organization,
            'currencies' => $currencies,
        ]);
    }

    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . optional($organization->user)->id,
            'password' => 'nullable|string|min:8|confirmed',

            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'status' => 'boolean',
            'default_currency' => 'required|string|exists:currencies,code',
        ]);



        $organization->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'status' => $validated['status'] ?? false,
            'default_currency' => $validated['default_currency'],
        ]);

        if ($organization->user) {
            $updateUser = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $updateUser['password'] = Hash::make($validated['password']);
            }

            $organization->user->update($updateUser);
        }

        return redirect()
            ->route('admin.organizations.index')
            ->with('success', 'Organization updated successfully');
    }


    public function destroy(Organization $organization)
    {
        // Delete the associated user first
        if ($organization->user) {
            $organization->user()->delete();
        }
        // Then delete the organization
        $organization->delete();

        return redirect()
            ->route('admin.organizations.index')
            ->with('success', 'Organization and associated user deleted successfully');
    }

    public function updatePassword(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Update the user's password if the organization has a linked user
        if ($organization->user) {
            $organization->user->update([
                'password' => Hash::make($validated['password']),
            ]);

            return redirect()->route('admin.organizations.index')->with('success', 'Password updated successfully');
        }

        return redirect()->route('admin.organizations.index')->with('error', 'No user account found for this organization');
    }

}
