<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Rating;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the student's own profile
     */
    public function show()
    {
        $student = Auth::user()->userable;

        // Load relationships
        $student->load(['club', 'organization', 'certifications', 'attendances', 'payments']);

        // Get ratings received
        $ratingsReceived = Rating::with(['rater'])
            ->where('rated_id', $student->id)
            ->where('rated_type', 'App\Models\Student')
            ->latest()
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => $rating->id,
                    'rating' => $rating->rating,
                    'comment' => $rating->comment,
                    'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
                    'rater_name' => $rating->rater->name ?? 'Unknown',
                    'rater_type' => class_basename($rating->rater_type),
                ];
            });

        // Get ratings given by this student
        $ratingsGiven = Rating::with(['rated'])
            ->where('rater_id', $student->id)
            ->where('rater_type', 'App\Models\Student')
            ->latest()
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => $rating->id,
                    'rating' => $rating->rating,
                    'comment' => $rating->comment,
                    'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
                    'rated_name' => $rating->rated->name ?? 'Unknown',
                    'rated_type' => class_basename($rating->rated_type),
                ];
            });

        // Get instructors for rating
        $instructors = Instructor::where('club_id', $student->club_id)
            ->orWhere('organization_id', $student->organization_id)
            ->get(['id', 'name', 'grade']);

        return Inertia::render('Student/Profile/Show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'surname' => $student->surname,
                'email' => $student->email,
                'phone' => $student->phone,
                'grade' => $student->grade,
                'gender' => $student->gender,
                'dob' => $student->dob,
                'nationality' => $student->nationality,
                'city' => $student->city,
                'country' => $student->country,
                'profile_image' => $student->profile_image,
                'club' => $student->club ? [
                    'id' => $student->club->id,
                    'name' => $student->club->name,
                ] : null,
                'organization' => $student->organization ? [
                    'id' => $student->organization->id,
                    'name' => $student->organization->name,
                ] : null,
                'average_rating' => $student->average_rating,
                'total_ratings' => $student->total_ratings,
            ],
            'ratingsReceived' => $ratingsReceived,
            'ratingsGiven' => $ratingsGiven,
            'instructors' => $instructors,
            'stats' => [
                'certifications_count' => $student->certifications->count(),
                'attendances_count' => $student->attendances->count(),
                'payments_count' => $student->payments->count(),
            ],
        ]);
    }

    /**
     * Display another student's profile (for rating purposes)
     */
    public function showStudent($id)
    {
        $currentStudent = Auth::user()->userable;
        $student = Student::with(['club', 'organization'])
            ->where('id', $id)
            ->where(function ($query) use ($currentStudent) {
                $query->where('club_id', $currentStudent->club_id)
                    ->orWhere('organization_id', $currentStudent->organization_id);
            })
            ->firstOrFail();

        // Get ratings received by this student
        $ratingsReceived = Rating::with(['rater'])
            ->where('rated_id', $student->id)
            ->where('rated_type', 'App\Models\Student')
            ->latest()
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => $rating->id,
                    'rating' => $rating->rating,
                    'comment' => $rating->comment,
                    'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
                    'rater_name' => $rating->rater->name ?? 'Unknown',
                    'rater_type' => class_basename($rating->rater_type),
                ];
            });

        // Check if current user has already rated this student
        $existingRating = Rating::where('rater_id', $currentStudent->id)
            ->where('rater_type', 'App\Models\Student')
            ->where('rated_id', $student->id)
            ->where('rated_type', 'App\Models\Student')
            ->first();

        return Inertia::render('Student/Profile/ShowStudent', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'surname' => $student->surname,
                'grade' => $student->grade,
                'gender' => $student->gender,
                'profile_image' => $student->profile_image,
                'club' => $student->club ? [
                    'id' => $student->club->id,
                    'name' => $student->club->name,
                ] : null,
                'organization' => $student->organization ? [
                    'id' => $student->organization->id,
                    'name' => $student->organization->name,
                ] : null,
                'average_rating' => $student->average_rating,
                'total_ratings' => $student->total_ratings,
            ],
            'ratingsReceived' => $ratingsReceived,
            'existingRating' => $existingRating ? [
                'id' => $existingRating->id,
                'rating' => $existingRating->rating,
                'comment' => $existingRating->comment,
            ] : null,
        ]);
    }

    /**
     * Display an instructor's profile (for rating purposes)
     */
    public function showInstructor($id)
    {
        $currentStudent = Auth::user()->userable;
        $instructor = Instructor::with(['club', 'organization'])
            ->where('id', $id)
            ->where(function ($query) use ($currentStudent) {
                $query->where('club_id', $currentStudent->club_id)
                    ->orWhere('organization_id', $currentStudent->organization_id);
            })
            ->firstOrFail();

        // Get ratings received by this instructor
        $ratingsReceived = Rating::with(['rater'])
            ->where('rated_id', $instructor->id)
            ->where('rated_type', 'App\Models\Instructor')
            ->latest()
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => $rating->id,
                    'rating' => $rating->rating,
                    'comment' => $rating->comment,
                    'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
                    'rater_name' => $rating->rater->name ?? 'Unknown',
                    'rater_type' => class_basename($rating->rater_type),
                ];
            });

        // Check if current user has already rated this instructor
        $existingRating = Rating::where('rater_id', $currentStudent->id)
            ->where('rater_type', 'App\Models\Student')
            ->where('rated_id', $instructor->id)
            ->where('rated_type', 'App\Models\Instructor')
            ->first();

        return Inertia::render('Student/Profile/ShowInstructor', [
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'grade' => $instructor->grade,
                'email' => $instructor->email,
                'mobile' => $instructor->mobile,
                'profile_picture' => $instructor->profile_picture,
                'club' => $instructor->club ? [
                    'id' => $instructor->club->id,
                    'name' => $instructor->club->name,
                ] : null,
                'organization' => $instructor->organization ? [
                    'id' => $instructor->organization->id,
                    'name' => $instructor->organization->name,
                ] : null,
                'average_rating' => $instructor->average_rating,
                'total_ratings' => $instructor->total_ratings,
            ],
            'ratingsReceived' => $ratingsReceived,
            'existingRating' => $existingRating ? [
                'id' => $existingRating->id,
                'rating' => $existingRating->rating,
                'comment' => $existingRating->comment,
            ] : null,
        ]);
    }
}