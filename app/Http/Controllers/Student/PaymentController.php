<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Currency;
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
            ->where('payment_month', 'LIKE', $year . '-%')
            ->with('currency')
            ->orderBy('pay_at', 'desc')
            ->get();

        // Calculate payment statistics with currency breakdown
        $totalPayments = $payments->count();
        $paidPayments = $payments->where('status', 'paid')->count();
        $pendingPayments = $payments->where('status', 'pending')->count();

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
            ->with(['student.club', 'student.organization', 'currency'])
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
            'bankInfo'
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
        $filename = 'Invoice_' . $invoiceNumber . '_' . now()->format('Y-m-d') . '.pdf';

        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
