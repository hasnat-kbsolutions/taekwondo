<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Club;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Organization;
use App\Models\Rating;

class ProfileController extends Controller
{
    public function show()
    {
        $club = auth()->user()->userable;
        
        // Get ratings received by the club
        $ratingsReceived = Rating::where('rated_id', $club->id)
            ->where('rated_type', 'App\\Models\\Club')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($rating) {
                // Get rater information based on the morphTo relationship
                $rater = null;
                if ($rating->rater_type && $rating->rater_id) {
                    $raterModel = $rating->rater_type;
                    $rater = $raterModel::find($rating->rater_id);
                }
                
                // Get rater name based on the model type
                $raterName = 'Anonymous';
                if ($rater) {
                    if ($rater instanceof \App\Models\Student) {
                        $raterName = $rater->name . ' ' . $rater->surname;
                    } elseif ($rater instanceof \App\Models\Instructor) {
                        $raterName = $rater->name;
                    } elseif ($rater instanceof \App\Models\Club) {
                        $raterName = $rater->name;
                    } elseif ($rater instanceof \App\Models\Organization) {
                        $raterName = $rater->name;
                    } else {
                        $raterName = $rater->name ?? 'Unknown';
                    }
                }
                
                return [
                    'id' => $rating->id,
                    'rating' => $rating->rating,
                    'comment' => $rating->comment,
                    'created_at' => $rating->created_at,
                    'rater_name' => $raterName,
                    'rater_type' => $rater ? class_basename($rating->rater_type) : 'Unknown',
                ];
            });
        

        
        // Calculate statistics
        $stats = [
            'students_count' => $club->students()->count(),
            'instructors_count' => $club->instructors()->count(),
            'certifications_count' => $club->students()->withCount('certifications')->get()->sum('certifications_count'),
            'attendances_count' => $club->students()->withCount('attendances')->get()->sum('attendances_count'),
            'payments_count' => $club->students()->withCount('payments')->get()->sum('payments_count'),
        ];
        
        // Calculate average rating
        $averageRating = $ratingsReceived->avg('rating');
        $totalRatings = $ratingsReceived->count();
        
        $club->average_rating = $averageRating;
        $club->total_ratings = $totalRatings;
        
        return Inertia::render('Club/Profile/Show', [
            'club' => $club,
            'ratingsReceived' => $ratingsReceived,
            'stats' => $stats,
        ]);
    }

    public function showClub($id)
    {
        $club = Club::with(['organization', 'instructors', 'students'])->findOrFail($id);
        
        // Get ratings received by the club
        $ratingsReceived = Rating::where('rated_id', $club->id)
            ->where('rated_type', 'App\\Models\\Club')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($rating) {
                // Get rater information based on the morphTo relationship
                $rater = null;
                if ($rating->rater_type && $rating->rater_id) {
                    $raterModel = $rating->rater_type;
                    $rater = $raterModel::find($rating->rater_id);
                }
                
                // Get rater name based on the model type
                $raterName = 'Anonymous';
                if ($rater) {
                    if ($rater instanceof \App\Models\Student) {
                        $raterName = $rater->name . ' ' . $rater->surname;
                    } elseif ($rater instanceof \App\Models\Instructor) {
                        $raterName = $rater->name;
                    } elseif ($rater instanceof \App\Models\Club) {
                        $raterName = $rater->name;
                    } elseif ($rater instanceof \App\Models\Organization) {
                        $raterName = $rater->name;
                    } else {
                        $raterName = $rater->name ?? 'Unknown';
                    }
                }
                
                return [
                    'id' => $rating->id,
                    'rating' => $rating->rating,
                    'comment' => $rating->comment,
                    'created_at' => $rating->created_at,
                    'rater_name' => $raterName,
                    'rater_type' => $rater ? class_basename($rating->rater_type) : 'Unknown',
                ];
            });
        

        
        // Calculate statistics
        $stats = [
            'students_count' => $club->students()->count(),
            'instructors_count' => $club->instructors()->count(),
            'certifications_count' => $club->students()->withCount('certifications')->get()->sum('certifications_count'),
            'attendances_count' => $club->students()->withCount('attendances')->get()->sum('attendances_count'),
            'payments_count' => $club->students()->withCount('payments')->get()->sum('payments_count'),
        ];
        
        // Calculate average rating
        $averageRating = $ratingsReceived->avg('rating');
        $totalRatings = $ratingsReceived->count();
        
        $club->average_rating = $averageRating;
        $club->total_ratings = $totalRatings;
        
        return Inertia::render('Club/Profile/Show', [
            'club' => $club,
            'ratingsReceived' => $ratingsReceived,
            'stats' => $stats,
        ]);
    }

    public function showStudent($id)
    {
        $student = Student::with(['user', 'club', 'organization'])->findOrFail($id);
        
        return Inertia::render('Club/Profile/ShowStudent', [
            'student' => $student,
        ]);
    }

    public function showInstructor($id)
    {
        $instructor = Instructor::with(['user', 'organization'])->findOrFail($id);
        
        return Inertia::render('Club/Profile/ShowInstructor', [
            'instructor' => $instructor,
        ]);
    }

    public function showOrganization($id)
    {
        $organization = Organization::with(['clubs', 'instructors', 'students'])->findOrFail($id);
        
        return Inertia::render('Club/Profile/ShowOrganization', [
            'organization' => $organization,
        ]);
    }
}
