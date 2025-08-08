<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certification;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CertificationController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user()->userable;

        $query = Certification::with(['student.club.organization'])
            ->where('student_id', $student->id)
            ->latest();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('notes', 'like', "%{$search}%");
        }

        $certifications = $query->get()
            ->map(function ($certification) {
                return [
                    'id' => $certification->id,
                    'file' => $certification->file,
                    'issued_at' => $certification->issued_at
                        ? \Carbon\Carbon::parse($certification->issued_at)->toDateString()
                        : null,
                    'notes' => $certification->notes,
                ];
            });

        return Inertia::render('Student/Certifications/Index', [
            'certifications' => $certifications,
            'filters' => $request->only(['search']),
        ]);
    }
}