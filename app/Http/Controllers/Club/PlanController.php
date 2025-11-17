<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        // Get plans associated with this club
        $plans = Plan::where('planable_type', 'App\Models\Club')
            ->where('planable_id', $clubId)
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Club/Plans/Index', [
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Club/Plans/Create', [
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($clubId) {
                    $exists = Plan::where('name', $value)
                        ->where('planable_type', 'App\Models\Club')
                        ->where('planable_id', $clubId)
                        ->exists();
                    if ($exists) {
                        $fail('A plan with this name already exists for your club.');
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
            'planable_id' => $clubId,
        ]);

        return redirect()->route('club.plans.index')->with('success', 'Plan created successfully.');
    }

    public function edit(Plan $plan)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        // Verify plan belongs to this club
        $plan->load('planable');
        if (!$plan->planable || $plan->planable_id !== $clubId) {
            abort(403, 'Unauthorized to access this plan.');
        }

        return Inertia::render('Club/Plans/Edit', [
            'plan' => $plan,
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        // Verify plan belongs to this club
        $plan->load('planable');
        if (!$plan->planable || $plan->planable_id !== $clubId) {
            abort(403, 'Unauthorized to update this plan.');
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request, $plan, $clubId) {
                    $exists = Plan::where('name', $value)
                        ->where('planable_type', 'App\Models\Club')
                        ->where('planable_id', $clubId)
                        ->where('id', '!=', $plan->id)
                        ->exists();
                    if ($exists) {
                        $fail('A plan with this name already exists for your club.');
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
        ]);

        return redirect()->route('club.plans.index')->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        // Verify plan belongs to this club
        $plan->load('planable');
        if (!$plan->planable || $plan->planable_id !== $clubId) {
            abort(403, 'Unauthorized to delete this plan.');
        }

        $plan->delete();
        return redirect()->route('club.plans.index')->with('success', 'Plan deleted successfully.');
    }
}

