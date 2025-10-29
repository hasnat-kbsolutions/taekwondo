<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display the invoice for any payment
     * Route: /invoice/{payment}
     */
    public function show(Request $request, Payment $payment)
    {
        // Load necessary relationships
        $payment->load(['student.club', 'student.organization', 'currency']);

        // Pass the payment to the view
        return Inertia::render('Invoice', [
            'payment' => $payment,
        ]);
    }

    /**
     * Download invoice as PDF for any payment
     * Route: /invoice/{payment}/download
     */
    public function download(Request $request, Payment $payment)
    {
        // Load necessary relationships
        $payment->load(['student.club', 'student.organization', 'currency']);

        // Get the authenticated user's role to determine access
        $user = Auth::user();

        // Check if user has access to this payment
        if ($user->role === 'student') {
            // Student can only access their own payments
            if ($payment->student_id !== $user->userable_id) {
                abort(403, 'Unauthorized access');
            }
        } elseif ($user->role === 'organization') {
            // Organization can access payments from their students
            $studentIds = $user->userable->students->pluck('id')->toArray();
            if (!in_array($payment->student_id, $studentIds)) {
                abort(403, 'Unauthorized access');
            }
        } elseif ($user->role === 'club') {
            // Club can access payments from their students
            $studentIds = $user->userable->students->pluck('id')->toArray();
            if (!in_array($payment->student_id, $studentIds)) {
                abort(403, 'Unauthorized access');
            }
        }
        // Admin can access all payments

        // Prepare data for PDF generation (reuse the student download logic)
        $student = $payment->student;
        $club = $student->club;
        $organization = $student->organization;
        $currency = $payment->currency;

        $invoiceNumber = ($club->invoice_prefix ?? 'INV') . '-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT);
        $invoiceDate = $payment->pay_at ? \Carbon\Carbon::parse($payment->pay_at)->format('F d, Y') : '-';

        $bankInfo = $payment->bank_information ?? [];
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
        $html = view('invoice', compact(
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
        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isFontSubsettingEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');
        $options->set('debugLayout', false);
        $options->set('debugLayoutLines', false);
        $options->set('debugLayoutPaddingBox', false);

        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $filename = 'Invoice_' . $invoiceNumber . '_' . now()->format('Y-m-d') . '.pdf';

        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
