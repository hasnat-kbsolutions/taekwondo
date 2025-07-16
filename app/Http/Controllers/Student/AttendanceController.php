<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user()->userable;
        $year = $request->input('year', now()->year);
        
        $attendances = $student->attendances()
        ->whereYear('date', $year)
        ->get()
        ->keyBy(fn($a) => Carbon::parse($a->date)->format('Y-m-d'));
        
        

        return Inertia::render('Student/Attendences/Index', [
            'attendance' => $attendances->map(fn($a) => $a->status),
            'year' => $year,
        ]);
    }
}
