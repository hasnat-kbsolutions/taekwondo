<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Club;
use App\Models\Student;
use App\Models\Supporter;

class OrganizationController extends Controller
{
    public function index()
    {
        $organizations = Organization::with(['clubs', 'students', 'supporters'])->get();

        return Inertia::render('Organizations/Index', [
            'organizations' => $organizations,
        ]);
    }


    public function create()
    {
        return Inertia::render('Organizations/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'boolean',
        ]);

        Organization::create($request->all());

        return redirect()->route('organizations.index')->with('success', 'Organization created successfully');
    }

    public function edit(Organization $organization)
    {
        return Inertia::render('Organizations/Edit', [
            'organization' => $organization,
        ]);
    }

    public function update(Request $request, Organization $organization)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'boolean',
        ]);

        $organization->update($request->all());

        return redirect()->route('organizations.index')->with('success', 'Organization updated successfully');
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();

        return redirect()->route('organizations.index')->with('success', 'Organization deleted successfully');
    }
}
