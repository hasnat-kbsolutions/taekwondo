<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Currency;
use App\Models\Organization;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        $query = Plan::with(['planable.organization']);

        // Filter by organization
        if ($request->organization_id) {
            $query->whereHas('planable', function ($q) use ($request) {
                $q->where('organization_id', $request->organization_id);
            });
        }

        // Filter by club
        if ($request->club_id) {
            $query->where('planable_type', 'App\Models\Club')
                ->where('planable_id', $request->club_id);
        }

        $plans = $query->orderByDesc('id')->get();

        return Inertia::render('Admin/Plans/Index', [
            'plans' => $plans,
            'organizations' => Organization::all(),
            'clubs' => Club::with('organization')->get(),
            'currencies' => Currency::where('is_active', true)->get(),
            'filters' => $request->only(['organization_id', 'club_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Plans/Create', [
            'organizations' => Organization::all(),
            'clubs' => Club::with('organization')->get(),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'club_id' => 'required|exists:clubs,id',
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
                    $exists = Plan::where('name', $value)
                        ->where('planable_type', 'App\Models\Club')
                        ->where('planable_id', $request->club_id)
                        ->exists();
                    if ($exists) {
                        $fail('A plan with this name already exists for the selected club.');
                    }
                },
            ],
            'base_amount' => 'required|numeric|min:0',
            'currency_code' => 'required|exists:currencies,code',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        // Verify club belongs to organization
        $club = Club::findOrFail($validated['club_id']);
        if ($club->organization_id !== (int) $validated['organization_id']) {
            return back()->withErrors(['club_id' => 'The selected club does not belong to the selected organization.'])->withInput();
        }

        Plan::create([
            'name' => $validated['name'],
            'base_amount' => $validated['base_amount'],
            'currency_code' => $validated['currency_code'],
            'is_active' => $validated['is_active'] ?? true,
            'description' => $validated['description'] ?? null,
            'planable_type' => 'App\Models\Club',
            'planable_id' => $validated['club_id'],
        ]);

        return redirect()->route('admin.plans.index')->with('success', 'Plan created successfully.');
    }

    public function edit(Plan $plan)
    {
        $plan->load('planable');
        $club = $plan->planable;
        $organization = $club ? $club->organization : null;

        return Inertia::render('Admin/Plans/Edit', [
            'plan' => $plan,
            'organization_id' => $organization?->id,
            'club_id' => $club?->id,
            'organizations' => Organization::all(),
            'clubs' => Club::with('organization')->get(),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'club_id' => 'required|exists:clubs,id',
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request, $plan) {
                    $exists = Plan::where('name', $value)
                        ->where('planable_type', 'App\Models\Club')
                        ->where('planable_id', $request->club_id)
                        ->where('id', '!=', $plan->id)
                        ->exists();
                    if ($exists) {
                        $fail('A plan with this name already exists for the selected club.');
                    }
                },
            ],
            'base_amount' => 'required|numeric|min:0',
            'currency_code' => 'required|exists:currencies,code',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        // Verify club belongs to organization
        $club = Club::findOrFail($validated['club_id']);
        if ($club->organization_id !== (int) $validated['organization_id']) {
            return back()->withErrors(['club_id' => 'The selected club does not belong to the selected organization.'])->withInput();
        }

        $plan->update([
            'name' => $validated['name'],
            'base_amount' => $validated['base_amount'],
            'currency_code' => $validated['currency_code'],
            'is_active' => $validated['is_active'] ?? $plan->is_active,
            'description' => $validated['description'] ?? null,
            'planable_type' => 'App\Models\Club',
            'planable_id' => $validated['club_id'],
        ]);

        return redirect()->route('admin.plans.index')->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->route('admin.plans.index')->with('success', 'Plan deleted successfully.');
    }
}


