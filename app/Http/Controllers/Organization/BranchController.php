<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use illuminate\Support\Facades\Auth;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::with(['organization', 'user'])->where('organization_id',Auth::user()->userable_id)->get();

        return Inertia::render('Organization/Branches/Index', [
            'branches' => $branches,
        ]);
    }

    public function create()
    {
        return Inertia::render('Organization/Branches/Create');
        // return Inertia::render('Organization/Branches/Create', [
        //     'organizations' => Organization::select('id', 'name')->get()
        // ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            // 'organization_id' => 'required|exists:organizations,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'status' => 'boolean',
        ]);

        $branch = Branch::create([
            'organization_id' => Auth::user()->userable_id,
            'name' => $validated['name'],
            'country' => $validated['country'] ?? null,
            'city' => $validated['city'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'status' => $validated['status'] ?? false,
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make('password'),
            'role' => 'branch',
            'userable_type' => Branch::class,
            'userable_id' => $branch->id,
        ]);

        return redirect()->route('organization.branches.index')->with('success', 'Branch created successfully');
    }

    public function edit(Branch $branch)
    {
        return Inertia::render('Organization/Branches/Edit', [
            'branch' => $branch,
            // 'organizations' => Organization::select('id', 'name')->get(), // Make sure it's a collection/array
        ]);
    }


    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . optional($branch->user)->id,
            // 'organization_id' => 'required|exists:organizations,id',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'status' => 'boolean',
        ]);

        $branch->update([
            'name' => $validated['name'],
            'country' => $validated['country'] ?? null,
            'city' => $validated['city'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'status' => $validated['status'] ?? false,
        ]);

        if ($branch->user) {
            $branch->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);
        }

        return redirect()->route('organization.branches.index')->with('success', 'Branch updated successfully');
    }

    public function destroy(Branch $branch)
    {
        if ($branch->user) {
            $branch->user->delete();
        }

        $branch->delete();

        return redirect()->route( 'organization.branches.index')->with('success', 'Branch deleted successfully');
    }
}
