<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Plan;
use App\Models\StudentFeePlan;
use App\Models\Currency;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Notifications\StudentFeePlanAssigned;

class StudentFeePlanController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        $query = StudentFeePlan::with(['student.club', 'student.organization', 'plan'])
            ->whereHas('student', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            });

        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }
        if ($request->plan_id) {
            $query->where('plan_id', $request->plan_id);
        }
        if ($request->interval) {
            $query->where('interval', $request->interval);
        }

        $feePlans = $query->orderByDesc('id')->get();

        $students = Student::where('organization_id', $organizationId)->get();

        // Get organization-level plans
        $organizationPlans = Plan::where('planable_type', 'App\Models\Organization')
            ->where('planable_id', $organizationId)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        // Get club-level plans for this organization's clubs
        $clubIds = Club::where('organization_id', $organizationId)
            ->pluck('id')
            ->toArray();
        $clubPlans = Plan::where('planable_type', 'App\Models\Club')
            ->whereIn('planable_id', $clubIds)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        $plans = $organizationPlans->merge($clubPlans);

        return Inertia::render('Organization/StudentFeePlans/Index', [
            'feePlans' => $feePlans,
            'students' => $students,
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
            'filters' => $request->only(['student_id', 'plan_id', 'interval']),
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Get organization-level plans
        $organizationPlans = Plan::where('planable_type', 'App\Models\Organization')
            ->where('planable_id', $organizationId)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        // Get club-level plans for this organization's clubs
        $clubIds = Club::where('organization_id', $organizationId)
            ->pluck('id')
            ->toArray();
        $clubPlans = Plan::where('planable_type', 'App\Models\Club')
            ->whereIn('planable_id', $clubIds)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        $plans = $organizationPlans->merge($clubPlans);

        return Inertia::render('Organization/StudentFeePlans/Create', [
            'students' => Student::where('organization_id', $organizationId)->with('club')->get(),
            'plans' => $plans,
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
            'student_id' => 'required|exists:students,id|unique:student_fee_plans,student_id',
            'plan_id' => 'nullable|exists:plans,id',
            'custom_amount' => 'nullable|numeric|min:0',
            'currency_code' => 'nullable|exists:currencies,code',
            'interval' => 'required|in:monthly,quarterly,semester,yearly,custom',
            'interval_count' => 'nullable|integer|min:1',
            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => 'nullable|numeric|min:0',
            'effective_from' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        // Verify student belongs to organization
        $student = Student::findOrFail($validated['student_id']);
        if ($student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to assign fee plan to this student.');
        }

        // Verify plan belongs to organization or organization's clubs (if plan_id is provided)
        if (!empty($validated['plan_id'])) {
            $plan = Plan::findOrFail($validated['plan_id']);
            $organizationClubIds = Club::where('organization_id', $organizationId)->pluck('id')->toArray();
            $isOrganizationPlan = $plan->planable_type === 'App\Models\Organization' && $plan->planable_id === $organizationId;
            $isClubPlan = $plan->planable_type === 'App\Models\Club' && in_array($plan->planable_id, $organizationClubIds);
            if (!$isOrganizationPlan && !$isClubPlan) {
                abort(403, 'Unauthorized to assign this plan to a student.');
            }
        }

        // Enforce interval_count if custom
        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        $feePlan = StudentFeePlan::create($validated);

        // Send notification to student
        if ($student->user) {
            $student->notify(new StudentFeePlanAssigned($feePlan));
        }

        return redirect()->route('organization.student-fee-plans.index')->with('success', 'Student fee plan created.');
    }

    public function edit(StudentFeePlan $studentFeePlan)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify student fee plan belongs to organization
        if ($studentFeePlan->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to access this student fee plan.');
        }

        // Get organization-level plans
        $organizationPlans = Plan::where('planable_type', 'App\Models\Organization')
            ->where('planable_id', $organizationId)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        // Get club-level plans for this organization's clubs
        $clubIds = Club::where('organization_id', $organizationId)
            ->pluck('id')
            ->toArray();
        $clubPlans = Plan::where('planable_type', 'App\Models\Club')
            ->whereIn('planable_id', $clubIds)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        $plans = $organizationPlans->merge($clubPlans);

        return Inertia::render('Organization/StudentFeePlans/Edit', [
            'studentFeePlan' => $studentFeePlan->load(['student.club', 'plan']),
            'students' => Student::where('organization_id', $organizationId)->with('club')->get(),
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, StudentFeePlan $studentFeePlan)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify student fee plan belongs to organization
        if ($studentFeePlan->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to access this student fee plan.');
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id|unique:student_fee_plans,student_id,' . $studentFeePlan->id,
            'plan_id' => 'nullable|exists:plans,id',
            'custom_amount' => 'nullable|numeric|min:0',
            'currency_code' => 'nullable|exists:currencies,code',
            'interval' => 'required|in:monthly,quarterly,semester,yearly,custom',
            'interval_count' => 'nullable|integer|min:1',
            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => 'nullable|numeric|min:0',
            'effective_from' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        // Verify student belongs to organization
        $student = Student::findOrFail($validated['student_id']);
        if ($student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to assign fee plan to this student.');
        }

        // Verify plan belongs to organization's clubs (if plan_id is provided)
        if (!empty($validated['plan_id'])) {
            $plan = Plan::findOrFail($validated['plan_id']);
            $organizationClubIds = Club::where('organization_id', $organizationId)->pluck('id')->toArray();
            if ($plan->planable_type !== 'App\Models\Club' || !in_array($plan->planable_id, $organizationClubIds)) {
                abort(403, 'Unauthorized to assign this plan to a student.');
            }
        }

        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        $studentFeePlan->update($validated);

        // Send notification to student
        if ($student->user) {
            $student->notify(new StudentFeePlanAssigned($studentFeePlan));
        }

        return redirect()->route('organization.student-fee-plans.index')->with('success', 'Student fee plan updated.');
    }

    public function destroy(StudentFeePlan $studentFeePlan)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify student fee plan belongs to organization
        if ($studentFeePlan->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to delete this student fee plan.');
        }

        $studentFeePlan->delete();
        return redirect()->route('organization.student-fee-plans.index')->with('success', 'Student fee plan deleted.');
    }
}

