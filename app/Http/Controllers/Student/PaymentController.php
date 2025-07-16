<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user()->userable;
        $year = $request->input('year', now()->year);

        $payments = $student->payments()
            ->whereYear('payment_month', $year)
            ->orderBy('pay_at', 'desc')
            ->get();

        return Inertia::render('Student/Payments/Index', [
            'payments' => $payments,
            'year' => $year,
        ]);
    }
}
