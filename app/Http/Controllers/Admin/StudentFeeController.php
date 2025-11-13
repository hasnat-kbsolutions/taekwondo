<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentFee;
use App\Models\Student;
use App\Models\FeeType;
use App\Models\StudentBalance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentFeeController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentFee::with(['student.club', 'student.organization', 'feeType']);

        // Filter by student
        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by fee type
        if ($request->fee_type_id) {
            $query->where('fee_type_id', $request->fee_type_id);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by month (support year-only or full YYYY-MM)
        if ($request->month) {
            $month = $request->month;
            if (strlen($month) === 4) { // Year only (e.g., "2025")
                $query->where('month', 'LIKE', "$month-%");
            } elseif (strlen($month) === 7) { // Full YYYY-MM (e.g., "2025-07")
                $query->where('month', $month);
            }
        }

        $studentFees = $query->latest()->get();

        // Calculate statistics
        $totalFees = $studentFees->count();
        $pendingFees = $studentFees->where('status', 'pending')->count();
        $partialFees = $studentFees->where('status', 'partial')->count();
        $paidFees = $studentFees->where('status', 'paid')->count();

        return Inertia::render('Admin/StudentFees/Index', [
            'studentFees' => $studentFees,
            'students' => Student::all(),
            'feeTypes' => FeeType::all(),
            'filters' => $request->only(['student_id', 'fee_type_id', 'status', 'month']),
            'totalFees' => $totalFees,
            'pendingFees' => $pendingFees,
            'partialFees' => $partialFees,
            'paidFees' => $paidFees,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/StudentFees/Create', [
            'students' => Student::all(),
            'feeTypes' => FeeType::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_type_id' => 'required|integer|exists:fee_types,id',
            'month' => 'required|string|size:7|regex:/^\d{4}-\d{2}$/', // YYYY-MM format
            'amount' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'fine' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
        ]);

        // Convert fee_type_id to integer if it comes as string
        $validated['fee_type_id'] = (int) $validated['fee_type_id'];
        $validated['student_id'] = (int) $validated['student_id'];

        // Check for duplicate fee
        $exists = StudentFee::where('student_id', $validated['student_id'])
            ->where('fee_type_id', $validated['fee_type_id'])
            ->where('month', $validated['month'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['month' => 'A fee for this student, fee type, and month already exists.'])->withInput();
        }

        $studentFee = StudentFee::create($validated);

        // Update student balance
        StudentBalance::updateBalance($validated['student_id']);

        return redirect()->route('admin.student-fees.index')->with('success', 'Student fee created successfully.');
    }

    public function edit(StudentFee $studentFee)
    {
        return Inertia::render('Admin/StudentFees/Edit', [
            'studentFee' => $studentFee->load(['student', 'feeType']),
            'students' => Student::all(),
            'feeTypes' => FeeType::all(),
        ]);
    }

    public function update(Request $request, StudentFee $studentFee)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_type_id' => 'required|exists:fee_types,id',
            'month' => 'required|string|size:7|regex:/^\d{4}-\d{2}$/',
            'amount' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'fine' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
        ]);

        // Check for duplicate fee (excluding current record)
        $exists = StudentFee::where('student_id', $validated['student_id'])
            ->where('fee_type_id', $validated['fee_type_id'])
            ->where('month', $validated['month'])
            ->where('id', '!=', $studentFee->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['month' => 'A fee for this student, fee type, and month already exists.'])->withInput();
        }

        $studentFee->update($validated);

        // Update student balance
        StudentBalance::updateBalance($validated['student_id']);

        return redirect()->route('admin.student-fees.index')->with('success', 'Student fee updated successfully.');
    }

    public function destroy(StudentFee $studentFee)
    {
        $studentId = $studentFee->student_id;
        $studentFee->delete();

        // Update student balance
        StudentBalance::updateBalance($studentId);

        return redirect()->route('admin.student-fees.index')->with('success', 'Student fee deleted successfully.');
    }
}

