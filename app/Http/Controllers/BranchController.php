<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::all();

        return Inertia::render('Branches/Index', [
            'branches' => $branches,
        ]);
    }

    public function create()
    {
        return Inertia::render('Branches/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'logo_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'boolean',
        ]);

        $data = $request->except('logo_image');

        if ($request->hasFile('logo_image')) {
            $data['logo_image'] = $request->file('logo_image')->store('branches', 'public');
        }

        Branch::create($data);

        return redirect()->route('branches.index')->with('success', 'Branch created successfully');
    }

    public function edit(Branch $branch)
    {
        return Inertia::render('Branches/Edit', [
            'branch' => $branch,
        ]);
    }

    public function update(Request $request, Branch $branch)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'logo_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'boolean',
        ]);

        $data = $request->except('logo_image');

        if ($request->hasFile('logo_image')) {
            if ($branch->logo_image) {
                Storage::disk('public')->delete($branch->logo_image);
            }
            $data['logo_image'] = $request->file('logo_image')->store('branches', 'public');
        }

        $branch->update($data);

        return redirect()->route('branches.index')->with('success', 'Branch updated successfully');
    }

    public function destroy(Branch $branch)
    {
        if ($branch->logo_image) {
            Storage::disk('public')->delete($branch->logo_image);
        }

        $branch->delete();

        return redirect()->route('branches.index')->with('success', 'Branch deleted successfully');
    }
}
