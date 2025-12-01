<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Organization;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Club;
use App\Models\Rating;

class ProfileController extends Controller
{
    public function show()
    {
        $organization = auth()->user()->userable;
        
        // Get ratings received by the organization
        $ratingsReceived = Rating::where('rated_id', $organization->id)
            ->where('rated_type', 'App\\Models\\Organization')
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
        
        // Get students, instructors, and clubs for rating functionality
        $students = $organization->students()->select('id', 'name', 'surname', 'grade')->get();
        $instructors = $organization->instructors()->select('id', 'name')->get();
        $clubs = $organization->clubs()->select('id', 'name', 'city', 'country')->get();
        
        // Calculate statistics
        $stats = [
            'students_count' => $organization->students()->count(),
            'instructors_count' => $organization->instructors()->count(),
            'clubs_count' => $organization->clubs()->count(),
            'certifications_count' => $organization->students()->withCount('certifications')->get()->sum('certifications_count'),
            'attendances_count' => $organization->students()->withCount('attendances')->get()->sum('attendances_count'),
            'payments_count' => $organization->students()->withCount('payments')->get()->sum('payments_count'),
        ];
        
        // Calculate average rating
        $averageRating = $ratingsReceived->avg('rating');
        $totalRatings = $ratingsReceived->count();
        
        $organization->average_rating = $averageRating;
        $organization->total_ratings = $totalRatings;
        
        return Inertia::render('Organization/Profile/Show', [
            'organization' => $organization,
            'ratingsReceived' => $ratingsReceived,
            'students' => $students,
            'instructors' => $instructors,
            'clubs' => $clubs,
            'stats' => $stats,
        ]);
    }

    public function showOrganization($id)
    {
        $organization = Organization::findOrFail($id);
        
        // Get ratings received by the organization
        $ratingsReceived = Rating::where('rated_id', $organization->id)
            ->where('rated_type', 'App\\Models\\Organization')
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
        
        // Get students, instructors, and clubs for rating functionality
        $students = $organization->students()->select('id', 'name', 'surname', 'grade')->get();
        $instructors = $organization->instructors()->select('id', 'name')->get();
        $clubs = $organization->clubs()->select('id', 'name', 'city', 'country')->get();
        
        // Calculate statistics
        $stats = [
            'students_count' => $organization->students()->count(),
            'instructors_count' => $organization->instructors()->count(),
            'clubs_count' => $organization->clubs()->count(),
            'certifications_count' => $organization->students()->withCount('certifications')->get()->sum('certifications_count'),
            'attendances_count' => $organization->students()->withCount('attendances')->get()->sum('attendances_count'),
            'payments_count' => $organization->students()->withCount('payments')->get()->sum('payments_count'),
        ];
        
        // Calculate average rating
        $averageRating = $ratingsReceived->avg('rating');
        $totalRatings = $ratingsReceived->count();
        
        $organization->average_rating = $averageRating;
        $organization->total_ratings = $totalRatings;
        
        return Inertia::render('Organization/Profile/Show', [
            'organization' => $organization,
            'ratingsReceived' => $ratingsReceived,
            'students' => $students,
            'instructors' => $instructors,
            'clubs' => $clubs,
            'stats' => $stats,
        ]);
    }

    public function showStudent($id)
    {
        $student = Student::with(['user', 'club', 'organization', 'gradeHistories'])->findOrFail($id);

        // Format grade history
        $gradeHistory = $student->gradeHistories->map(function ($history) {
            return [
                'id' => $history->id,
                'grade_name' => $history->grade_name,
                'achieved_at' => $history->achieved_at->format('Y-m-d'),
                'achieved_at_formatted' => $history->achieved_at->format('M d, Y'),
                'duration_days' => $history->duration_days,
                'duration_formatted' => $this->formatDuration($history->duration_days),
                'notes' => $history->notes,
            ];
        });

        return Inertia::render('Organization/Profile/ShowStudent', [
            'student' => $student,
            'gradeHistory' => $gradeHistory,
        ]);
    }

    private function formatDuration($days)
    {
        if (!$days) {
            return 'Current';
        }

        $years = intdiv($days, 365);
        $months = intdiv(($days % 365), 30);
        $remainingDays = $days % 30;

        $parts = [];
        if ($years > 0) $parts[] = "$years year" . ($years > 1 ? 's' : '');
        if ($months > 0) $parts[] = "$months month" . ($months > 1 ? 's' : '');
        if ($remainingDays > 0 || empty($parts)) $parts[] = "$remainingDays day" . ($remainingDays > 1 ? 's' : '');

        return implode(', ', array_slice($parts, 0, 2));
    }

    public function showInstructor($id)
    {
        $instructor = Instructor::with(['user', 'organization'])->findOrFail($id);
        
        return Inertia::render('Organization/Profile/ShowInstructor', [
            'instructor' => $instructor,
        ]);
    }

    public function showClub($id)
    {
        $club = Club::with(['organization', 'instructors', 'students'])->findOrFail($id);
        
        return Inertia::render('Organization/Profile/ShowClub', [
            'club' => $club,
        ]);
    }
}
