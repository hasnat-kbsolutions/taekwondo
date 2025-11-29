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

        // Get plans associated with this organization
        $plans = Plan::where('planable_type', 'App\Models\Organization')
            ->where('planable_id', $organizationId)
            ->with('planable')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Organization/Plans/Index', [
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Organization/Plans/Create', [
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
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($organizationId) {
                    $exists = Plan::where('name', $value)
                        ->where('planable_type', 'App\Models\Organization')
                        ->where('planable_id', $organizationId)
                        ->exists();
                    if ($exists) {
                        $fail('A plan with this name already exists for your organization.');
                    }
                },
            ],
            'base_amount' => 'required|numeric|min:0',
            'currency_code' => 'required|exists:currencies,code',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
            'interval' => 'required|in:monthly,quarterly,semester,yearly,custom',
            'interval_count' => 'nullable|integer|min:1',
            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => 'nullable|numeric|min:0',
            'effective_from' => 'nullable|date',
        ]);

        Plan::create([
            'name' => $validated['name'],
            'base_amount' => $validated['base_amount'],
            'currency_code' => $validated['currency_code'],
            'is_active' => $validated['is_active'] ?? true,
            'description' => $validated['description'] ?? null,
            'interval' => $validated['interval'],
            'interval_count' => $validated['interval_count'] ?? null,
            'discount_type' => $validated['discount_type'] ?? null,
            'discount_value' => $validated['discount_value'] ?? null,
            'effective_from' => $validated['effective_from'] ?? null,
            'planable_type' => 'App\Models\Organization',
            'planable_id' => $organizationId,
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

        // Verify plan belongs to this organization
        if ($plan->planable_type !== 'App\Models\Organization' || $plan->planable_id !== $organizationId) {
            abort(403, 'Unauthorized to access this plan.');
        }

        return Inertia::render('Organization/Plans/Edit', [
            'plan' => $plan,
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

        // Verify plan belongs to this organization
        if ($plan->planable_type !== 'App\Models\Organization' || $plan->planable_id !== $organizationId) {
            abort(403, 'Unauthorized to update this plan.');
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($organizationId, $plan) {
                    $exists = Plan::where('name', $value)
                        ->where('planable_type', 'App\Models\Organization')
                        ->where('planable_id', $organizationId)
                        ->where('id', '!=', $plan->id)
                        ->exists();
                    if ($exists) {
                        $fail('A plan with this name already exists for your organization.');
                    }
                },
            ],
            'base_amount' => 'required|numeric|min:0',
            'currency_code' => 'required|exists:currencies,code',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
            'interval' => 'required|in:monthly,quarterly,semester,yearly,custom',
            'interval_count' => 'nullable|integer|min:1',
            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => 'nullable|numeric|min:0',
            'effective_from' => 'nullable|date',
        ]);

        $plan->update([
            'name' => $validated['name'],
            'base_amount' => $validated['base_amount'],
            'currency_code' => $validated['currency_code'],
            'is_active' => $validated['is_active'] ?? $plan->is_active,
            'description' => $validated['description'] ?? null,
            'interval' => $validated['interval'],
            'interval_count' => $validated['interval_count'] ?? null,
            'discount_type' => $validated['discount_type'] ?? null,
            'discount_value' => $validated['discount_value'] ?? null,
            'effective_from' => $validated['effective_from'] ?? null,
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

        // Verify plan belongs to this organization
        if ($plan->planable_type !== 'App\Models\Organization' || $plan->planable_id !== $organizationId) {
            abort(403, 'Unauthorized to delete this plan.');
        }

        $plan->delete();
        return redirect()->route('organization.plans.index')->with('success', 'Plan deleted successfully.');
    }
}

