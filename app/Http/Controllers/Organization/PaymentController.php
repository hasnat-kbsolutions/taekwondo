<?php

namespace App\Http\Controllers\Organization;
use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Models\Student;
use App\Models\StudentFeePlan;
use App\Models\Currency;
use App\Models\BankInformation;
use App\Models\PaymentAttachment;
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

        $query = Payment::with(['student', 'currency', 'attachment'])
            ->whereHas('student', function ($query) use ($user) {
                $query->where('organization_id', $user->userable_id);
            });

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
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

        // Filter by currency_code
        if ($request->currency_code) {
            $query->where('currency_code', $request->currency_code);
        }

        // Filter by student
        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        $payments = $query->latest()->get();

        // Calculate payment statistics
        $totalPayments = $payments->count();
        $paidPayments = $payments->where('status', 'paid')->count();
        $unpaidPayments = $payments->where('status', 'unpaid')->count();

        // Calculate amounts by currency for summary
        $amountsByCurrency = $payments->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        $defaultCurrencyCode = $user->userable->default_currency ?? 'MYR';

        return Inertia::render('Organization/Payments/Index', [
            'payments' => $payments,
            'students' => Student::where('organization_id', $user->userable_id)->get(),
            'filters' => $request->only(['status', 'month', 'currency_code', 'student_id']),
            'currencies' => Currency::getActive(),
            'totalPayments' => $totalPayments,
            'paidPayments' => $paidPayments,
            'unpaidPayments' => $unpaidPayments,
            'amountsByCurrency' => $amountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Get students with fee plans in this organization
        $feePlans = StudentFeePlan::with(['plan', 'student'])
            ->whereHas('student', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            })
            ->get();

        $studentIdsWithPlans = $feePlans->pluck('student_id')->unique()->values();
        $studentsWithPlans = Student::where('organization_id', $organizationId)
            ->whereIn('id', $studentIdsWithPlans)
            ->get();

        return Inertia::render('Organization/Payments/Create', [
            'students' => $studentsWithPlans,
            'studentFeePlans' => $feePlans,
            'currencies' => Currency::getActive() ?? [],
            'bank_information' => BankInformation::where('userable_type', 'App\Models\Organization')
                ->where('userable_id', $organizationId)
                ->orWhere(function ($q) use ($user) {
                    $q->where('userable_type', 'App\Models\User')
                        ->where('userable_id', $user->id);
                })
                ->get() ?? [],
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

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

        // Verify student belongs to organization
        $student = Student::findOrFail($validated['student_id']);
        if ($student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to create payment for this student.');
        }

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

        return redirect()->route('organization.payments.index')->with('success', 'Payment added successfully.');
    }

    public function edit(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify payment belongs to organization
        if ($payment->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to access this payment.');
        }

        // Get students with fee plans in this organization
        $feePlans = StudentFeePlan::with(['plan', 'student'])
            ->whereHas('student', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            })
            ->get();

        return Inertia::render('Organization/Payments/Edit', [
            'payment' => $payment->load(['student']),
            'students' => Student::where('organization_id', $organizationId)->whereHas('feePlan')->get(),
            'studentFeePlans' => $feePlans,
            'currencies' => Currency::getActive(),
            'bank_information' => BankInformation::where('userable_type', 'App\Models\Organization')
                ->where('userable_id', $organizationId)
                ->orWhere(function ($q) use ($user) {
                    $q->where('userable_type', 'App\Models\User')
                        ->where('userable_id', $user->id);
                })
                ->get(),
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify payment belongs to organization
        if ($payment->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to update this payment.');
        }

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

        // Verify student belongs to organization
        $student = Student::findOrFail($validated['student_id']);
        if ($student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to update payment for this student.');
        }

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

        return redirect()->route('organization.payments.index')->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $organizationId = $user->userable_id;

        // Verify payment belongs to organization
        if ($payment->student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to delete this payment.');
        }

        $payment->delete();

        return redirect()->route('organization.payments.index')->with('success', 'Payment deleted successfully');
    }

    public function invoice(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }
        $payment->load(['student.club', 'student.organization', 'currency']);
        return Inertia::render('Invoice', [
            'payment' => $payment,
        ]);
    }

    public function updateStatus(Request $request, Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'status' => 'required|in:paid,unpaid',
        ]);

        $payment->update([
            'status' => $validated['status'],
        ]);

        return redirect()->route('organization.payments.index')->with('success', 'Payment status updated successfully');
    }

    /**
     * Upload payment attachment
     */
    public function uploadAttachment(Request $request, Payment $payment)
    {
        $request->validate([
            'attachment' => 'required|file|mimes:jpeg,jpg,png,pdf|max:5120',
            'description' => 'nullable|string|max:500',
            'replace_attachment_id' => 'nullable|exists:payment_attachments,id',
        ]);

        if ($request->replace_attachment_id) {
            $oldAttachment = PaymentAttachment::findOrFail($request->replace_attachment_id);

            if ($oldAttachment->payment_id !== $payment->id) {
                abort(403, 'Unauthorized to replace this attachment.');
            }

            $oldFile = storage_path('app/public/' . $oldAttachment->file_path);
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }

            $oldAttachment->delete();
        }

        $file = $request->file('attachment');
        $filename = 'payment_attachment_' . $payment->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('payment-attachments', $filename, 'public');

        PaymentAttachment::create([
            'payment_id' => $payment->id,
            'file_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
            'description' => $request->description,
        ]);

        $message = $request->replace_attachment_id
            ? 'Payment attachment replaced successfully.'
            : 'Payment attachment uploaded successfully.';

        return back()->with('success', $message);
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
