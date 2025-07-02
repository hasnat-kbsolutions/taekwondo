<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Student;
use App\Models\Organization;
use App\Models\Club;

use App\Models\Supporter;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function index()
    {
        $club = Auth::user()->userable;

        // Get student IDs in this club
        $studentIds = $club->students()->pluck('id');

        // Fetch payments for these students
        $payments = Payment::whereIn('student_id', $studentIds)->get();

        return Inertia::render('Club/Dashboard', [
            'studentsCount' => $club->students()->count(),
            'paymentsCount' => $payments->count(),
            'totalAmount' => $payments->sum('amount'),
            'paidCount' => $payments->where('status', 'paid')->count(),
            'pendingCount' => $payments->where('status', 'pending')->count(),
            'recentPayments' => $payments->sortByDesc('pay_at')->take(5)->values(),
        ]);
    }
}
