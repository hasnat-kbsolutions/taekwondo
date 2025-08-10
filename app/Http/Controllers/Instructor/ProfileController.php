<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Rating;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the instructor's own profile
     */
    public function show()
    {
        $instructor = Auth::user()->userable;

        // Load relationships
        $instructor->load(['club', 'organization', 'students']);

        // Get ratings received
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

        // Get students for rating
        $students = Student::where('club_id', $instructor->club_id)
            ->orWhere('organization_id', $instructor->organization_id)
            ->get(['id', 'name', 'surname', 'grade']);

        return Inertia::render('Instructor/Profile/Show', [
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
                'mobile' => $instructor->mobile,
                'grade' => $instructor->grade,
                'gender' => $instructor->gender,
                'address' => $instructor->address,
                'ic_number' => $instructor->ic_number,
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
            'students' => $students,
            'stats' => [
                'students_count' => $instructor->students->count(),
            ],
        ]);
    }

    /**
     * Display another instructor's profile (for rating purposes)
     */
    public function showInstructor($id)
    {
        $currentInstructor = Auth::user()->userable;
        $instructor = Instructor::with(['club', 'organization'])
            ->where('id', $id)
            ->where(function ($query) use ($currentInstructor) {
                $query->where('club_id', $currentInstructor->club_id)
                    ->orWhere('organization_id', $currentInstructor->organization_id);
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
        $existingRating = Rating::where('rater_id', $currentInstructor->id)
            ->where('rater_type', 'App\Models\Instructor')
            ->where('rated_id', $instructor->id)
            ->where('rated_type', 'App\Models\Instructor')
            ->first();

        return Inertia::render('Instructor/Profile/ShowInstructor', [
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'grade' => $instructor->grade,
                'gender' => $instructor->gender,
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

    /**
     * Display a student's profile (for rating purposes)
     */
    public function showStudent($id)
    {
        $currentInstructor = Auth::user()->userable;
        $student = Student::with(['club', 'organization'])
            ->where('id', $id)
            ->where(function ($query) use ($currentInstructor) {
                $query->where('club_id', $currentInstructor->club_id)
                    ->orWhere('organization_id', $currentInstructor->organization_id);
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
        $existingRating = Rating::where('rater_id', $currentInstructor->id)
            ->where('rater_type', 'App\Models\Instructor')
            ->where('rated_id', $student->id)
            ->where('rated_type', 'App\Models\Student')
            ->first();

        return Inertia::render('Instructor/Profile/ShowStudent', [
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
}