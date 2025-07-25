<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['student.club', 'student.organization']);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by payment_month (support year-only or full YYYY-MM)
        if ($request->payment_month) {
            $paymentMonth = $request->payment_month;
            if (strlen($paymentMonth) === 4) { // Year only (e.g., "2025")
                $query->where('payment_month', 'LIKE', "$paymentMonth-%");
            } elseif (strlen($paymentMonth) === 7) { // Full YYYY-MM (e.g., "2025-07")
                $query->where('payment_month', $paymentMonth);
            }
        }

        $payments = $query->latest()->get();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['status', 'payment_month']),
        ]);
    }

    public function invoice(Payment $payment)
    {
        $payment->load(['student.club', 'student.organization']);
        return Inertia::render('Admin/Payments/Invoice', [
            'payment' => $payment,
        ]);
    }





    public function create()
    {
        return Inertia::render('Admin/Payments/Create', [
            'students' => Student::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:paid,unpaid',
            'method' => 'required|in:cash,stripe',
            'payment_month' => 'required|string|size:2',
            'pay_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Combine current year with selected month for "YYYY-MM" format
        $year = now()->year;
        $payment_month = $year . '-' . $validated['payment_month'];

        Payment::create([
            'student_id' => $validated['student_id'],
            'amount' => $validated['amount'],
            'status' => $validated['status'],
            'method' => $validated['method'],
            'payment_month' => $payment_month,
            'pay_at' => $validated['pay_at'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('admin.payments.index')->with('success', 'Payment added successfully.');
    }

    public function edit(Payment $payment)
    {
        return Inertia::render('Admin/Payments/Edit', [
            'payment' => $payment,
            'students' => Student::all(),
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:paid,unpaid',
            'method' => 'required|in:cash,stripe',
            'payment_month' => 'required|string|size:2',
            'pay_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Combine current year with selected month for "YYYY-MM" format
        $year = now()->year;
        $payment_month = $year . '-' . $validated['payment_month'];

        $payment->update([
            'student_id' => $validated['student_id'],
            'amount' => $validated['amount'],
            'status' => $validated['status'],
            'method' => $validated['method'],
            'payment_month' => $payment_month,
            'pay_at' => $validated['pay_at'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('admin.payments.index')->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->route('admin.payments.index')->with('success', 'Payment deleted successfully');
    }
}
