<?php

namespace App\Http\Controllers\Organization;
use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Models\Student;
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

        // Filter by payment_month (support year-only or full YYYY-MM)
        if ($request->payment_month) {
            $paymentMonth = $request->payment_month;
            if (strlen($paymentMonth) === 4) { // Year only (e.g., "2025")
                $query->where('payment_month', 'LIKE', "$paymentMonth-%");
            } elseif (strlen($paymentMonth) === 7) { // Full YYYY-MM (e.g., "2025-07")
                $query->where('payment_month', $paymentMonth);
            }
        }

        // Filter by currency_code
        if ($request->currency_code) {
            $query->where('currency_code', $request->currency_code);
        }

        $payments = $query->latest()->get();

        // Calculate amounts by currency for summary
        $amountsByCurrency = $payments->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        $defaultCurrencyCode = $user->userable->default_currency ?? 'MYR';

        return Inertia::render('Organization/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['status', 'payment_month', 'currency_code']),
            'amountsByCurrency' => $amountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
            'currencies' => Currency::getActive(),
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

        // Get selected bank information details
        $selectedBanks = [];
        if (!empty($validated['bank_information'])) {
            $selectedBanks = BankInformation::whereIn('id', $validated['bank_information'])->get()->toArray();
        }

        $paymentData = $validated;
        $paymentData['bank_information'] = $selectedBanks;

        Payment::create($paymentData);

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

        // Get selected bank information details
        $selectedBanks = [];
        if (!empty($validated['bank_information'])) {
            $selectedBanks = BankInformation::whereIn('id', $validated['bank_information'])->get()->toArray();
        }

        $paymentData = $validated;
        $paymentData['bank_information'] = $selectedBanks;

        $payment->update($paymentData);

        return redirect()->route('organization.payments.index')->with('success', 'Payment updated successfully');
    }

    public function invoice(Payment $payment)
    {
        $user = Auth::user();
        if ($user->role !== 'organization') {
            abort(403, 'Unauthorized');
        }
        $payment->load(['student.club', 'student.organization', 'currency']);
        return Inertia::render('Organization/Payments/Invoice', [
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
