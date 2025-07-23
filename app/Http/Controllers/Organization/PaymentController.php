<?php

namespace App\Http\Controllers\Organization;
use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $query = Payment::with('student')
            ->whereHas('student', function ($query) use ($user) {
                $query->where('organization_id', $user->userable_id);
            });

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

        return Inertia::render('Organization/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['status', 'payment_month']),
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $students = Student::where('organization_id', $user->userable_id)->get();

        return Inertia::render('Organization/Payments/Create', [
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric',
            'method' => 'required|in:cash,stripe,bank,other',
            'status' => 'required|in:unpaid,pending,paid,failed,refunded',
            'payment_month' => 'required|string|size:2',
            'pay_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $year = now()->year;
        $validated['payment_month'] = $year . '-' . $validated['payment_month'];

        Payment::create($validated);

        return redirect()->route('organization.payments.index')->with('success', 'Payment created successfully');
    }

    public function edit(Payment $payment)
    {


        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $students = Student::where('organization_id', $user->userable_id)->get();

        return Inertia::render('Organization/Payments/Edit', [
            'payment' => $payment,
            'students' => $students,
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric',
            'method' => 'required|in:cash,stripe,bank,other',
            'status' => 'required|in:unpaid,pending,paid,failed,refunded',
            'payment_month' => 'required|string|size:2',
            'pay_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $year = now()->year;
        $validated['payment_month'] = $year . '-' . $validated['payment_month'];

        $payment->update($validated);

        return redirect()->route('organization.payments.index')->with('success', 'Payment updated successfully');
    }


    public function invoice(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }
        $payment->load(['student.club', 'student.organization']);
        return Inertia::render('Organization/Payments/Invoice', [
            'payment' => $payment,
        ]);
    }
}
