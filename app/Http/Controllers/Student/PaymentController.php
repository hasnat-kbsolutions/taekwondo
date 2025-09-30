<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Currency;
use Inertia\Inertia;

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
}
