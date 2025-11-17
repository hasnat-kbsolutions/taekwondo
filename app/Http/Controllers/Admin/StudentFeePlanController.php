<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Plan;
use App\Models\StudentFeePlan;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentFeePlanController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentFeePlan::with(['student.club', 'student.organization', 'plan']);

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

        return Inertia::render('Admin/StudentFeePlans/Index', [
            'feePlans' => $feePlans,
            'students' => Student::all(),
            'plans' => Plan::where('is_active', true)->get(),
            'currencies' => Currency::where('is_active', true)->get(),
            'filters' => $request->only(['student_id', 'plan_id', 'interval']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/StudentFeePlans/Create', [
            'students' => Student::with('club')->get(),
            'plans' => Plan::where('planable_type', 'App\Models\Club')
                ->where('is_active', true)
                ->with('planable')
                ->get(),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
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

        // Enforce interval_count if custom
        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        StudentFeePlan::create($validated);

        return redirect()->route('admin.student-fee-plans.index')->with('success', 'Student fee plan created.');
    }

    public function edit(StudentFeePlan $studentFeePlan)
    {
        return Inertia::render('Admin/StudentFeePlans/Edit', [
            'studentFeePlan' => $studentFeePlan->load(['student.club', 'plan']),
            'students' => Student::with('club')->get(),
            'plans' => Plan::where('planable_type', 'App\Models\Club')
                ->where('is_active', true)
                ->with('planable')
                ->get(),
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, StudentFeePlan $studentFeePlan)
    {
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

        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        $studentFeePlan->update($validated);

        return redirect()->route('admin.student-fee-plans.index')->with('success', 'Student fee plan updated.');
    }

    public function destroy(StudentFeePlan $studentFeePlan)
    {
        $studentFeePlan->delete();
        return redirect()->route('admin.student-fee-plans.index')->with('success', 'Student fee plan deleted.');
    }
}


