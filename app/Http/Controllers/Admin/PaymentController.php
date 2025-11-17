<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Models\Student;
// StudentFee removed
use App\Models\StudentFeePlan;
use App\Models\Currency;
use App\Models\BankInformation;
use App\Models\PaymentAttachment;
// StudentBalance removed
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['student', 'currency', 'attachment']);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by currency
        if ($request->currency_code) {
            $query->where('currency_code', $request->currency_code);
        }

        // Filter by student
        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by month (support year-only or full YYYY-MM)
        if ($request->month) {
            $month = $request->month;
            if (strlen($month) === 4) {
                $query->where('month', 'LIKE', "$month-%");
            } elseif (strlen($month) === 7) {
                $query->where('month', $month);
            }
        }

        $payments = $query->latest()->get();

        // Calculate payment statistics
        $totalPayments = $payments->count();
        $paidPayments = $payments->where('status', 'paid')->count();
        $unpaidPayments = $payments->where('status', 'unpaid')->count();

        // Calculate amounts by currency
        $amountsByCurrency = $payments->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        // Get default currency for display
        $defaultCurrency = Currency::where('is_default', true)->first();
        $defaultCurrencyCode = $defaultCurrency ? $defaultCurrency->code : 'MYR';

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'students' => Student::all(),
            'filters' => $request->only(['status', 'month', 'currency_code', 'student_id']),
            'currencies' => Currency::where('is_active', true)->get(),
            'totalPayments' => $totalPayments,
            'paidPayments' => $paidPayments,
            'unpaidPayments' => $unpaidPayments,
            'amountsByCurrency' => $amountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
        ]);
    }

    public function invoice(Payment $payment)
    {
        $payment->load(['student', 'currency', 'attachment']);
        return Inertia::render('Invoice', [
            'payment' => $payment,
        ]);
    }

    public function create()
    {
        $feePlans = StudentFeePlan::with(['plan', 'student'])->get();
        $studentIdsWithPlans = $feePlans->pluck('student_id')->unique()->values();
        $studentsWithPlans = Student::whereIn('id', $studentIdsWithPlans)->get();

        return Inertia::render('Admin/Payments/Create', [
            'students' => $studentsWithPlans,
            'studentFeePlans' => $feePlans,
            'currencies' => Currency::getActive() ?? [],
            'bank_information' => BankInformation::where('userable_type', 'App\Models\User')->get() ?? [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'month' => 'nullable|string|size:7|regex:/^\d{4}-\d{2}$/',
            'amount' => 'required|numeric|min:0',
            'currency_code' => 'required|exists:currencies,code',
            'status' => 'required|in:paid,unpaid',
            'method' => 'required|in:cash,card,stripe',
            'pay_at' => 'nullable|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'transaction_id' => 'nullable|string',
            'bank_information' => 'nullable|array',
            'bank_information.*' => 'exists:bank_information,id',
        ]);

        // Get selected bank information details
        $selectedBanks = [];
        if (!empty($validated['bank_information'])) {
            $selectedBanks = BankInformation::whereIn('id', $validated['bank_information'])->get()->toArray();
        }

        Payment::create([
            'student_id' => $validated['student_id'],
            'month' => $validated['month'] ?? null,
            'amount' => $validated['amount'],
            'currency_code' => $validated['currency_code'],
            'status' => $validated['status'],
            'method' => $validated['method'],
            'pay_at' => $validated['pay_at'] ?? now(),
            'due_date' => $validated['due_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'transaction_id' => $validated['transaction_id'] ?? null,
            'bank_information' => $selectedBanks,
        ]);

        return redirect()->route('admin.payments.index')->with('success', 'Payment added successfully.');
    }

    public function edit(Payment $payment)
    {
        return Inertia::render('Admin/Payments/Edit', [
            'payment' => $payment->load(['student']),
            'students' => Student::all(),
            'studentFeePlans' => StudentFeePlan::with(['plan', 'student'])->get(),
            'currencies' => Currency::getActive(),
            'bank_information' => BankInformation::where('userable_type', 'App\Models\User')->get(),
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'month' => 'nullable|string|size:7|regex:/^\d{4}-\d{2}$/',
            'amount' => 'required|numeric|min:0',
            'currency_code' => 'required|exists:currencies,code',
            'status' => 'required|in:paid,unpaid',
            'method' => 'required|in:cash,card,stripe',
            'pay_at' => 'nullable|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'transaction_id' => 'nullable|string',
            'bank_information' => 'nullable|array',
            'bank_information.*' => 'exists:bank_information,id',
        ]);

        // Get selected bank information details
        $selectedBanks = [];
        if (!empty($validated['bank_information'])) {
            $selectedBanks = BankInformation::whereIn('id', $validated['bank_information'])->get()->toArray();
        }

        $payment->update([
            'student_id' => $validated['student_id'],
            'month' => $validated['month'] ?? null,
            'amount' => $validated['amount'],
            'currency_code' => $validated['currency_code'],
            'status' => $validated['status'],
            'method' => $validated['method'],
            'pay_at' => $validated['pay_at'] ?? $payment->pay_at,
            'due_date' => $validated['due_date'] ?? $payment->due_date,
            'notes' => $validated['notes'] ?? null,
            'transaction_id' => $validated['transaction_id'] ?? null,
            'bank_information' => $selectedBanks,
        ]);

        return redirect()->route('admin.payments.index')->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        // Balance updates removed with StudentFee/StudentBalance removal

        return redirect()->route('admin.payments.index')->with('success', 'Payment deleted successfully');
    }

    public function updateStatus(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'status' => 'required|in:paid,unpaid',
        ]);

        $payment->update([
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.payments.index')->with('success', 'Payment status updated successfully');
    }

    /**
     * Upload payment attachment
     */
    public function uploadAttachment(Request $request, Payment $payment)
    {
        $request->validate([
            'attachment' => 'required|file|mimes:jpeg,jpg,png,pdf|max:5120', // 5MB max
            'description' => 'nullable|string|max:500',
        ]);

        // Store the file
        $file = $request->file('attachment');
        $filename = 'payment_attachment_' . $payment->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('payment-attachments', $filename, 'public');

        // Create attachment record
        PaymentAttachment::create([
            'payment_id' => $payment->id,
            'file_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
            'description' => $request->description,
        ]);

        return back()->with('success', 'Payment attachment uploaded successfully.');
    }

    /**
     * Download payment attachment
     */
    public function downloadAttachment(PaymentAttachment $attachment)
    {
        $filePath = storage_path('app/public/' . $attachment->file_path);

        if (!file_exists($filePath)) {
            abort(404, 'Attachment file not found.');
        }

        return response()->download($filePath, $attachment->original_filename);
    }

    /**
     * Delete payment attachment
     */
    public function deleteAttachment(PaymentAttachment $attachment)
    {
        $filePath = storage_path('app/public/' . $attachment->file_path);
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $attachment->delete();

        return back()->with('success', 'Attachment deleted successfully.');
    }
}
