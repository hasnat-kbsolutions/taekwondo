<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Student;
use App\Models\Organization;
use App\Models\Branch;
use App\Models\Club;
use App\Models\Supporter;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function index()
    {
        $organization = Auth::user()->userable;

        // Get all student IDs under this organization
        $studentIds = $organization->students()->pluck('id');

        // Get payment statistics
        $payments = Payment::whereIn('student_id', $studentIds);

        $paymentsCount = $payments->count();
        $paidCount = $payments->where('status', 'paid')->count();
        $pendingCount = $payments->where('status', 'pending')->count();
        $totalAmount = $payments->sum('amount');

        return Inertia::render('Organization/Dashboard', [
            'studentsCount' => $organization->students()->count(),
            'branchesCount' => $organization->branches()->count(),
            'paymentsCount' => $paymentsCount,
            'paidCount' => $paidCount,
            'pendingCount' => $pendingCount,
            'totalAmount' => $totalAmount,
        ]);
    }
}
