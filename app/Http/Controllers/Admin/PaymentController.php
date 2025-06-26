<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('student')->latest()->get();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
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
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric',
            'method' => 'required|in:cash,stripe,bank,other',
            'status' => 'required|in:pending,paid,failed,refunded',
            'payment_month' => 'required|date_format:Y-m',
            'pay_at' => 'nullable|date',
            'notes' => 'nullable|string',
            'transaction_id' => 'nullable|string|max:255',
        ]);

        Payment::create($request->all());

        return redirect()->route('admin.payments.index')->with('success', 'Payment created successfully');
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
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric',
            'method' => 'required|in:cash,stripe,bank,other',
            'status' => 'required|in:pending,paid,failed,refunded',
            'payment_month' => 'required|date_format:Y-m',
            'pay_at' => 'nullable|date',
            'notes' => 'nullable|string',
            'transaction_id' => 'nullable|string|max:255',
        ]);

        $payment->update($request->all());

        return redirect()->route('admin.payments.index')->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->route('admin.payments.index')->with('success', 'Payment deleted successfully');
    }
}
