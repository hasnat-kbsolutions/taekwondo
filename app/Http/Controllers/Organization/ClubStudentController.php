<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ClubStudentController extends Controller
{
    /**
     * Display students of a specific club for organization view
     */
    public function index(Request $request, Club $club)
    {
        $user = Auth::user();
        $organizationId = $user->userable_id;

        // Verify the club belongs to this organization
        if ($club->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to view this club\'s students.');
        }

        $students = Student::query()
            ->with(['organization', 'club']) // eager load relations
            ->where('club_id', $club->id)
            ->when($request->filled('nationality') && $request->nationality !== 'all', function ($query) use ($request) {
                $query->where('nationality', $request->nationality);
            })
            ->when($request->filled('country') && $request->country !== 'all', function ($query) use ($request) {
                $query->where('country', $request->country);
            })
            ->when($request->filled('status') && $request->status !== 'all', function ($query) use ($request) {
                $query->where('status', $request->status === 'active' ? true : false);
            })
            ->latest()
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'uid' => $student->uid,
                    'code' => $student->code,
                    'name' => $student->name,
                    'surname' => $student->surname,
                    'email' => $student->email,
                    'phone' => $student->phone,
                    'grade' => $student->grade,
                    'gender' => $student->gender,
                    'nationality' => $student->nationality,
                    'country' => $student->country,
                    'status' => $student->status,
                    'organization' => $student->organization,
                    'club' => $student->club,
                    'average_rating' => $student->average_rating,
                    'total_ratings' => $student->total_ratings,
                    'profile_image' => $student->profile_image,
                    'identification_document' => $student->identification_document,
                    'dob' => $student->dob,
                    'dod' => $student->dod,
                    'id_passport' => $student->id_passport,
                    'city' => $student->city,
                    'postal_code' => $student->postal_code,
                    'street' => $student->street,
                ];
            });

        return Inertia::render('Organization/Clubs/Students/Index', [
            'club' => $club,
            'students' => $students,
            'nationalities' => Student::where('club_id', $club->id)->select('nationality')->distinct()->pluck('nationality'),
            'countries' => Student::where('club_id', $club->id)->select('country')->distinct()->pluck('country'),
            'filters' => [
                'nationality' => $request->nationality,
                'country' => $request->country,
                'status' => $request->status,
            ],
        ]);
    }
}
