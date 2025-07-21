<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function organizationsReport(Request $request)
    {
        $organizations = Organization::withCount(['clubs', 'students', 'instructors'])
            ->get()
            ->map(function ($org) {
                // Get all student IDs for this org
                $studentIds = Student::where('organization_id', $org->id)->pluck('id');
                // Revenue: sum of paid payments
                $revenue = Payment::whereIn('student_id', $studentIds)
                    ->where('status', 'paid')
                    ->sum('amount');
                // Unpaid: sum of unpaid payments
                $unpaid = Payment::whereIn('student_id', $studentIds)
                    ->where('status', '!=', 'paid')
                    ->sum('amount');
                // Optionally, add more metrics here
                $org->revenue = $revenue;
                $org->unpaid = $unpaid;
                return $org;
            });

        return Inertia::render('Admin/Reports/Reports', [
            'organizations' => $organizations,
        ]);
    }
}