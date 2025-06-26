<?php

namespace App\Http\Controllers\Branch;
use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class PaymentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role !== 'branch') {
            abort(403, 'Unauthorized');
        }

        $payments = Payment::with('student')
            ->whereHas('student', function ($query) use ($user) {
                $query->where('organization_id', $user->userable->organization_id);
                $query->where('branch_id', $user->userable_id);
            })
            ->latest()
            ->get();

        return Inertia::render('Branch/Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'branch') {
            abort(403, 'Unauthorized');
        }

        $students = Student::where('organization_id', $user->userable->organization_id)->where('branch_id', $user->userable_id)->get();

        return Inertia::render('Branch/Payments/Create', [
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

        return redirect()->route('branch.payments.index')->with('success', 'Payment created successfully');
    }

    public function edit(Payment $payment)
    {


        $user = Auth::user();
        if ($user->role !== 'branch') {
            abort(403, 'Unauthorized');
        }

        $students = Student::where('organization_id', $user->userable->organization_id)->where('branch_id', $user->userable_id)->get();

        return Inertia::render('Branch/Payments/Edit', [
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

        return redirect()->route('branch.payments.index')->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'branch') {
            abort(403, 'Unauthorized');
        }

        $payment->delete();

        return redirect()->route('branch.payments.index')->with('success', 'Payment deleted successfully');
    }
}
