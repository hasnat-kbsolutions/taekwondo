<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $instructor = Auth::user()->userable;
        $studentsCount = $instructor->students()->count();

        // Get today's attendance count
        $todayAttendance = \App\Models\Attendance::whereHas('student.instructors', function ($q) use ($instructor) {
            $q->where('instructor_id', $instructor->id);
        })->whereDate('date', now())->count();

        return Inertia::render('Instructor/Dashboard', [
            'studentsCount' => $studentsCount,
            'todayAttendance' => $todayAttendance,
        ]);
    }
}