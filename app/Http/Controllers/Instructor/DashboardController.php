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
        return Inertia::render('Instructor/Dashboard', [
            'studentsCount' => $studentsCount,
        ]);
    }
}