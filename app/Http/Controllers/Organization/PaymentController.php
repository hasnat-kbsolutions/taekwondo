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

        $status = $request->input('status');
        $paymentMonth = $request->input('payment_month');

        $payments = Payment::with('student')
            ->whereHas('student', function ($query) use ($user) {
                $query->where('organization_id', $user->userable_id);
            })
            ->when($status, fn($q) => $q->where('status', $status))
            ->when($paymentMonth, fn($q) => $q->where('payment_month', $paymentMonth))
            ->latest()
            ->get();

        return Inertia::render('Organization/Payments/Index', [
            'payments' => $payments,
            'filters' => [
                'status' => $status,
                'payment_month' => $paymentMonth,
            ],
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
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric',
            'method' => 'required|in:cash,stripe,bank,other',
            'status' => 'required|in:pending,paid,failed,refunded',
            'payment_month' => 'required|date_format:Y-m',
            'pay_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        Payment::create($request->all());

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
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric',
            'method' => 'required|in:cash,stripe,bank,other',
            'status' => 'required|in:pending,paid,failed,refunded',
            'payment_month' => 'required|date_format:Y-m',
            'pay_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $payment->update($request->all());

        return redirect()->route('organization.payments.index')->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }
        
        $payment->delete();

        return redirect()->route('organization.payments.index')->with('success', 'Payment deleted successfully');
    }
}
