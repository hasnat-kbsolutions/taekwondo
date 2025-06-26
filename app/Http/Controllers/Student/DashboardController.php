<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\Payment;
use Carbon\Carbon;
use Inertia\Inertia;


class DashboardController extends Controller
{
    // StudentDashboardController.php
    public function index(Request $request)
    {
        $student = Auth::user()->userable;
        $year = $request->input('year', now()->year);

        $attendances = $student->attendances()
            ->whereYear('date', $year)
            ->get()
            ->keyBy(fn($a) => \Carbon\Carbon::parse($a->date)->format('Y-m-d'));

        $payments = $student->payments()
            ->whereYear('payment_month', $year)
            ->orderBy('pay_at', 'desc')
            ->get();

        return Inertia::render('Student/Dashboard', [
            'attendance' => $attendances->map(fn($a) => $a->status),
            'payments' => $payments,
            'year' => $year,
        ]);
    }







}
