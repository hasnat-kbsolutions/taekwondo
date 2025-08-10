<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Student;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Instructor;
use App\Models\Rating;

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
        $instructorIds = $organization->instructors()->pluck('id');

        // Get payment statistics
        $payments = Payment::whereIn('student_id', $studentIds);

        $paymentsCount = $payments->count();
        $paidCount = $payments->where('status', 'paid')->count();
        $pendingCount = $payments->where('status', 'pending')->count();
        $totalAmount = $payments->sum('amount');

        // Get rating statistics
        $studentRatings = Rating::whereIn('rated_id', $studentIds)
            ->where('rated_type', 'App\Models\Student');

        $instructorRatings = Rating::whereIn('rated_id', $instructorIds)
            ->where('rated_type', 'App\Models\Instructor');

        $avgStudentRating = $studentRatings->count() > 0 ? $studentRatings->avg('rating') : 0;
        $avgInstructorRating = $instructorRatings->count() > 0 ? $instructorRatings->avg('rating') : 0;
        $totalRatings = $studentRatings->count() + $instructorRatings->count();

        return Inertia::render('Organization/Dashboard', [
            'studentsCount' => $organization->students()->count(),
            'clubsCount' => $organization->clubs()->count(),
            'instructorsCount' => $organization->instructors()->count(),
            'paymentsCount' => $paymentsCount,
            'paidCount' => $paidCount,
            'pendingCount' => $pendingCount,
            'totalAmount' => $totalAmount,
            'avgStudentRating' => round($avgStudentRating, 1),
            'avgInstructorRating' => round($avgInstructorRating, 1),
            'totalRatings' => $totalRatings,
        ]);
    }
}
