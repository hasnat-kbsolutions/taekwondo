<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Currency;
use App\Models\Payment;
use App\Models\PaymentAttachment;
use Inertia\Inertia;
use Illuminate\Support\Facades\View;
use Dompdf\Dompdf;
use Dompdf\Options;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user()->userable;
        $year = $request->input('year', now()->year);

        $payments = $student->payments()
            ->where('month', 'LIKE', $year . '-%')
            ->with(['currency', 'attachment'])
            ->orderBy('pay_at', 'desc')
            ->get();

        // Calculate payment statistics with currency breakdown
        $totalPayments = $payments->count();
        $paidPayments = $payments->where('status', 'paid')->count();
        $pendingPayments = $payments->where('status', 'unpaid')->count();

        $amountsByCurrency = $payments->groupBy('currency_code')
            ->map(function ($currencyPayments) {
                return (float) $currencyPayments->sum('amount');
            });

        // Get default currency from student's club or organization
        $defaultCurrencyCode = $student->club->default_currency ??
            $student->organization->default_currency ??
            'MYR';

        return Inertia::render('Student/Payments/Index', [
            'payments' => $payments,
            'year' => $year,
            'totalPayments' => $totalPayments,
            'paidPayments' => $paidPayments,
            'pendingPayments' => $pendingPayments,
            'amountsByCurrency' => $amountsByCurrency,
            'defaultCurrencyCode' => $defaultCurrencyCode,
        ]);
    }

    public function invoice($paymentId)
    {
        $student = Auth::user()->userable;

        // Find the payment and verify it belongs to this student
        $payment = $student->payments()
            ->with(['student.club', 'student.organization', 'currency', 'attachment'])
            ->findOrFail($paymentId);

        return Inertia::render('Student/Payments/Invoice', [
            'payment' => $payment,
        ]);
    }

    public function downloadInvoice($paymentId, Request $request)
    {
        $student = Auth::user()->userable;

        // Find the payment and verify it belongs to this student
        $payment = $student->payments()
            ->with(['student.club', 'student.organization', 'currency'])
            ->findOrFail($paymentId);

        // Prepare data for PDF
        $club = $payment->student->club;
        $organization = $payment->student->organization;
        $currency = $payment->currency;
        $invoiceNumber = ($club->invoice_prefix ?? 'INV') . '-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT);
        $invoiceDate = $payment->pay_at ? \Carbon\Carbon::parse($payment->pay_at)->format('F d, Y') : '-';

        // Bank information is stored as JSON array in the payment model
        $bankInfo = $payment->bank_information ?? [];

        // For now, use a default payment item since items may not be separate
        $items = [];
        $totalAmount = number_format($payment->amount, 2);
        $itemAmount = number_format($payment->amount, 2);
        $currencySymbol = $currency->code === 'MYR' ? 'RM' : $currency->symbol;

        // Convert logo URL to base64 data URI for DomPDF
        $logoPath = null;
        if ($club->logo) {
            $fullPath = null;

            // Handle full URL
            if (filter_var($club->logo, FILTER_VALIDATE_URL)) {
                $parsedUrl = parse_url($club->logo);
                if (isset($parsedUrl['path'])) {
                    $relativePath = ltrim($parsedUrl['path'], '/');
                    $relativePath = str_replace('storage/', '', $relativePath);
                    $fullPath = public_path('storage/' . $relativePath);
                }
            } else {
                // Handle relative path
                $relativePath = ltrim($club->logo, '/');
                $relativePath = str_replace('storage/', '', $relativePath);
                $fullPath = public_path('storage/' . $relativePath);
            }

            // Check if file exists and convert to base64
            if ($fullPath && file_exists($fullPath)) {
                $imageData = file_get_contents($fullPath);
                $imageInfo = getimagesize($fullPath);

                if ($imageInfo !== false) {
                    $mimeType = $imageInfo['mime'];
                    $base64 = base64_encode($imageData);
                    $logoPath = 'data:' . $mimeType . ';base64,' . $base64;
                }
            }
        }

        // Generate HTML content
        $html = View::make('student.invoices.invoice', compact(
            'payment',
            'student',
            'club',
            'organization',
            'currency',
            'invoiceNumber',
            'invoiceDate',
            'items',
            'totalAmount',
            'itemAmount',
            'currencySymbol',
            'bankInfo',
            'logoPath'
        ))->render();

        // Create PDF using DomPDF
        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isFontSubsettingEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');
        $options->set('debugLayout', false);
        $options->set('debugLayoutLines', false);
        $options->set('debugLayoutPaddingBox', false);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        // Download the PDF
        $filename = $invoiceNumber . '.pdf';

        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * Upload payment attachment
     */
    public function uploadAttachment(Request $request, Payment $payment)
    {
        $student = Auth::user()->userable;

        // Verify payment belongs to student
        $payment = $student->payments()->findOrFail($payment->id);

        $request->validate([
            'attachment' => 'required|file|mimes:jpeg,jpg,png,pdf|max:5120', // 5MB max
            'description' => 'nullable|string|max:500',
            'replace_attachment_id' => 'nullable|exists:payment_attachments,id', // For replacing existing attachment
        ]);

        // If replacing, delete the old attachment
        if ($request->replace_attachment_id) {
            $oldAttachment = PaymentAttachment::findOrFail($request->replace_attachment_id);

            // Verify it belongs to this student's payment
            if ($oldAttachment->payment_id !== $payment->id) {
                abort(403, 'Unauthorized to replace this attachment.');
            }

            // Delete old file
            $oldFile = storage_path('app/public/' . $oldAttachment->file_path);
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }

            // Delete old record
            $oldAttachment->delete();
        }

        // Store the new file
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
        $student = Auth::user()->userable;

        // Verify attachment belongs to student's payment
        $attachment->load('payment');
        if ($attachment->payment->student_id !== $student->id) {
            abort(403, 'Unauthorized access to this attachment.');
        }

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
        $student = Auth::user()->userable;

        // Verify attachment belongs to student's payment
        $attachment->load('payment');
        if ($attachment->payment->student_id !== $student->id) {
            abort(403, 'Unauthorized access to this attachment.');
        }

        $filePath = storage_path('app/public/' . $attachment->file_path);
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $attachment->delete();

        return back()->with('success', 'Attachment deleted successfully.');
    }
}
