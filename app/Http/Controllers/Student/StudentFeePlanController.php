<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentFeePlan;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentFeePlanController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        if ($user->role !== 'student') {
            abort(403, 'Unauthorized');
        }

        $studentId = $user->userable_id;

        // Get the student's fee plan
        $feePlan = StudentFeePlan::with(['plan', 'student.club'])
            ->where('student_id', $studentId)
            ->first();

        return Inertia::render('Student/FeePlan/Show', [
            'feePlan' => $feePlan,
        ]);
    }
}
