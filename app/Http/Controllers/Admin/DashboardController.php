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


class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/dashboard', [
            'studentsCount' => Student::count(),
            'organizationsCount' => Organization::count(),
            'clubsCount' => Club::count(),
            'SupportersCount' => Supporter::count(),
        ]);
    }
}
