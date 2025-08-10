<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Student;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Supporter;
use App\Models\Instructor;
use App\Models\Rating;

class DashboardController extends Controller
{
    public function index()
    {
        // Get rating statistics
        $studentRatings = Rating::where('rated_type', 'App\Models\Student');
        $instructorRatings = Rating::where('rated_type', 'App\Models\Instructor');

        $avgStudentRating = $studentRatings->count() > 0 ? $studentRatings->avg('rating') : 0;
        $avgInstructorRating = $instructorRatings->count() > 0 ? $instructorRatings->avg('rating') : 0;
        $totalRatings = $studentRatings->count() + $instructorRatings->count();

        return Inertia::render('Admin/dashboard', [
            'studentsCount' => Student::count(),
            'organizationsCount' => Organization::count(),
            'clubsCount' => Club::count(),
            'SupportersCount' => Supporter::count(),
            'instructorsCount' => Instructor::count(),
            'avgStudentRating' => round($avgStudentRating, 1),
            'avgInstructorRating' => round($avgInstructorRating, 1),
            'totalRatings' => $totalRatings,
        ]);
    }
}
