<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Currency;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Get all clubs for this organization
        $clubIds = \App\Models\Club::where('organization_id', $organizationId)
            ->pluck('id')
            ->toArray();

        // Get plans associated with this organization's clubs
        $query = Plan::where('planable_type', 'App\Models\Club')
            ->whereIn('planable_id', $clubIds)
            ->with('planable');

        // Filter by club if specified
        if ($request->club_id) {
            $club = \App\Models\Club::find($request->club_id);
            if ($club && $club->organization_id === $organizationId) {
                $query->where('planable_id', $request->club_id);
            }
        }

        $plans = $query->orderByDesc('id')->get();

        return Inertia::render('Organization/Plans/Index', [
            'plans' => $plans,
            'clubs' => \App\Models\Club::where('organization_id', $organizationId)->get(),
            'currencies' => Currency::where('is_active', true)->get(),
            'filters' => $request->only(['club_id']),
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        return Inertia::render('Organization/Plans/Create', [
            'clubs' => Club::where('organization_id', $organizationId)->get(),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        $validated = $request->validate([
            'club_id' => [
                'required',
                'exists:clubs,id',
                function ($attribute, $value, $fail) use ($organizationId) {
                    $club = Club::find($value);
                    if (!$club || $club->organization_id !== $organizationId) {
                        $fail('The selected club does not belong to your organization.');
                    }
                },
            ],
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

        Plan::create([
            'name' => $validated['name'],
            'base_amount' => $validated['base_amount'],
            'currency_code' => $validated['currency_code'],
            'is_active' => $validated['is_active'] ?? true,
            'description' => $validated['description'] ?? null,
            'planable_type' => 'App\Models\Club',
            'planable_id' => $validated['club_id'],
        ]);

        return redirect()->route('organization.plans.index')->with('success', 'Plan created successfully.');
    }

    public function edit(Plan $plan)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify plan belongs to organization's club
        $plan->load('planable');
        $club = $plan->planable;
        if (!$club || $club->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to access this plan.');
        }

        return Inertia::render('Organization/Plans/Edit', [
            'plan' => $plan,
            'club_id' => $club->id,
            'clubs' => Club::where('organization_id', $organizationId)->get(),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify plan belongs to organization's club
        $plan->load('planable');
        $club = $plan->planable;
        if (!$club || $club->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to update this plan.');
        }

        $validated = $request->validate([
            'club_id' => [
                'required',
                'exists:clubs,id',
                function ($attribute, $value, $fail) use ($organizationId) {
                    $club = Club::find($value);
                    if (!$club || $club->organization_id !== $organizationId) {
                        $fail('The selected club does not belong to your organization.');
                    }
                },
            ],
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

        $plan->update([
            'name' => $validated['name'],
            'base_amount' => $validated['base_amount'],
            'currency_code' => $validated['currency_code'],
            'is_active' => $validated['is_active'] ?? $plan->is_active,
            'description' => $validated['description'] ?? null,
            'planable_type' => 'App\Models\Club',
            'planable_id' => $validated['club_id'],
        ]);

        return redirect()->route('organization.plans.index')->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify plan belongs to organization's club
        $plan->load('planable');
        $club = $plan->planable;
        if (!$club || $club->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to delete this plan.');
        }

        $plan->delete();
        return redirect()->route('organization.plans.index')->with('success', 'Plan deleted successfully.');
    }
}

