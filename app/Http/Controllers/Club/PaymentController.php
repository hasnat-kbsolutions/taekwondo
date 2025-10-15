<?php

namespace App\Http\Controllers\Club;
use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Models\Student;
use App\Models\Currency;
use App\Models\BankInformation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $query = Payment::with(['student', 'currency'])
            ->whereHas('student', function ($query) use ($user) {
                $query->where('organization_id', $user->userable->organization_id)
                    ->where('club_id', $user->userable_id);
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

        // Calculate payment statistics with currency breakdown
        $totalPayments = $payments->count();
        $paidPayments = $payments->where('status', 'paid')->count();
        $pendingPayments = $payments->where('status', 'pending')->count();

        $amountsByCurrency = $payments->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        $defaultCurrencyCode = $user->userable->default_currency ?? 'MYR';

        return Inertia::render('Club/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['status', 'payment_month']),
            'totalPayments' => $totalPayments,
            'paidPayments' => $paidPayments,
            'pendingPayments' => $pendingPayments,
            'amountsByCurrency' => $amountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $students = Student::where('organization_id', $user->userable->organization_id)->where('club_id', $user->userable_id)->get();

        return Inertia::render('Club/Payments/Create', [
            'students' => $students,
            'currencies' => Currency::getActive(),
            'defaultCurrency' => $user->userable->default_currency ?? 'MYR',
            'bank_information' => BankInformation::where('userable_type', 'App\Models\User')
                ->where('userable_id', $user->id)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric',
            'currency_code' => 'required|exists:currencies,code',
            'method' => 'required|in:cash,stripe,bank,other',
            'status' => 'required|in:unpaid,pending,paid,failed,refunded',
            'payment_month' => 'required|string|size:2',
            'pay_at' => 'required|date',
            'notes' => 'nullable|string',
            'bank_information' => 'nullable|array',
            'bank_information.*' => 'exists:bank_information,id',
        ]);

        $year = now()->year;
        $validated['payment_month'] = $year . '-' . $validated['payment_month'];

        // Handle bank information
        $selectedBanks = [];
        if (!empty($validated['bank_information'])) {
            $selectedBanks = BankInformation::whereIn('id', $validated['bank_information'])->get()->toArray();
        }

        $paymentData = $validated;
        $paymentData['bank_information'] = $selectedBanks;

        Payment::create($paymentData);

        return redirect()->route('club.payments.index')->with('success', 'Payment created successfully');
    }

    public function edit(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $students = Student::where('organization_id', $user->userable->organization_id)->where('club_id', $user->userable_id)->get();

        return Inertia::render('Club/Payments/Edit', [
            'payment' => $payment,
            'students' => $students,
            'currencies' => Currency::getActive(),
            'bank_information' => BankInformation::where('userable_type', 'App\Models\User')
                ->where('userable_id', $user->id)->get(),
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric',
            'currency_code' => 'required|exists:currencies,code',
            'method' => 'required|in:cash,stripe,bank,other',
            'status' => 'required|in:unpaid,pending,paid,failed,refunded',
            'payment_month' => 'required|string|size:2',
            'pay_at' => 'required|date',
            'notes' => 'nullable|string',
            'bank_information' => 'nullable|array',
            'bank_information.*' => 'exists:bank_information,id',
        ]);

        $year = now()->year;
        $validated['payment_month'] = $year . '-' . $validated['payment_month'];

        // Handle bank information
        $selectedBanks = [];
        if (!empty($validated['bank_information'])) {
            $selectedBanks = BankInformation::whereIn('id', $validated['bank_information'])->get()->toArray();
        }

        $paymentData = $validated;
        $paymentData['bank_information'] = $selectedBanks;

        $payment->update($paymentData);

        return redirect()->route('club.payments.index')->with('success', 'Payment updated successfully');
    }

    public function invoice(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }
        $payment->load(['student.club', 'student.organization', 'currency']);
        return Inertia::render('Club/Payments/Invoice', [
            'payment' => $payment,
        ]);
    }

    public function updateStatus(Request $request, Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'status' => 'required|in:paid,unpaid',
        ]);

        $payment->update([
            'status' => $validated['status'],
        ]);

        return redirect()->route('club.payments.index')->with('success', 'Payment status updated successfully');
    }
}
