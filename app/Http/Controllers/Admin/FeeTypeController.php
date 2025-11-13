<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeeType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeTypeController extends Controller
{
    public function index()
    {
        $feeTypes = FeeType::latest()->get();

        return Inertia::render('Admin/FeeTypes/Index', [
            'feeTypes' => $feeTypes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/FeeTypes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:fee_types,name',
            'default_amount' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        FeeType::create($validated);

        return redirect()->route('admin.fee-types.index')->with('success', 'Fee type created successfully.');
    }

    public function edit(FeeType $feeType)
    {
        return Inertia::render('Admin/FeeTypes/Edit', [
            'feeType' => $feeType,
        ]);
    }

    public function update(Request $request, FeeType $feeType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:fee_types,name,' . $feeType->id,
            'default_amount' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $feeType->update($validated);

        return redirect()->route('admin.fee-types.index')->with('success', 'Fee type updated successfully.');
    }

    public function destroy(FeeType $feeType)
    {
        // Check if fee type is being used
        if ($feeType->studentFees()->count() > 0) {
            return back()->with('error', 'Cannot delete fee type that is being used by student fees.');
        }

        $feeType->delete();

        return redirect()->route('admin.fee-types.index')->with('success', 'Fee type deleted successfully.');
    }
}

