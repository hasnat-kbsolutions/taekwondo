<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Plan;
use App\Models\StudentFeePlan;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StudentFeePlanController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        $query = StudentFeePlan::with(['student.club', 'student.organization', 'plan'])
            ->whereHas('student', function ($q) use ($clubId) {
                $q->where('club_id', $clubId);
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

        $students = Student::where('club_id', $clubId)->get();

        // Get plans for this club only
        $plans = Plan::where('planable_type', 'App\Models\Club')
            ->where('planable_id', $clubId)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        return Inertia::render('Club/StudentFeePlans/Index', [
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
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        // Get plans for this club only
        $plans = Plan::where('planable_type', 'App\Models\Club')
            ->where('planable_id', $clubId)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        return Inertia::render('Club/StudentFeePlans/Create', [
            'students' => Student::where('club_id', $clubId)->with('club')->get(),
            'plans' => $plans,
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

        // Verify student belongs to club
        $student = Student::findOrFail($validated['student_id']);
        if ($student->club_id !== $clubId) {
            abort(403, 'Unauthorized to assign fee plan to this student.');
        }

        // Enforce interval_count if custom
        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        StudentFeePlan::create($validated);

        return redirect()->route('club.student-fee-plans.index')->with('success', 'Student fee plan created.');
    }

    public function edit(StudentFeePlan $studentFeePlan)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        // Verify student fee plan belongs to club
        if ($studentFeePlan->student->club_id !== $clubId) {
            abort(403, 'Unauthorized to access this student fee plan.');
        }

        // Get plans for this club only
        $plans = Plan::where('planable_type', 'App\Models\Club')
            ->where('planable_id', $clubId)
            ->where('is_active', true)
            ->with('planable')
            ->get();

        return Inertia::render('Club/StudentFeePlans/Edit', [
            'studentFeePlan' => $studentFeePlan->load(['student.club', 'plan']),
            'students' => Student::where('club_id', $clubId)->with('club')->get(),
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, StudentFeePlan $studentFeePlan)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        // Verify student fee plan belongs to club
        if ($studentFeePlan->student->club_id !== $clubId) {
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

        // Verify student belongs to club
        $student = Student::findOrFail($validated['student_id']);
        if ($student->club_id !== $clubId) {
            abort(403, 'Unauthorized to assign fee plan to this student.');
        }

        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        $studentFeePlan->update($validated);

        return redirect()->route('club.student-fee-plans.index')->with('success', 'Student fee plan updated.');
    }

    public function destroy(StudentFeePlan $studentFeePlan)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $clubId = $user->userable_id;

        // Verify student fee plan belongs to club
        if ($studentFeePlan->student->club_id !== $clubId) {
            abort(403, 'Unauthorized to delete this student fee plan.');
        }

        $studentFeePlan->delete();
        return redirect()->route('club.student-fee-plans.index')->with('success', 'Student fee plan deleted.');
    }
}

