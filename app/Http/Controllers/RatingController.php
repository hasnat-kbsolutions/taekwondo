<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Student;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RatingController extends Controller
{
    /**
     * Display ratings for the authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $userable = $user->userable;

        $ratingsReceived = collect();
        $ratingsGiven = collect();

        if ($userable instanceof Student) {
            $ratingsReceived = Rating::with(['rater'])
                ->where('rated_id', $userable->id)
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

            $ratingsGiven = Rating::with(['rated'])
                ->where('rater_id', $userable->id)
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
        } elseif ($userable instanceof Instructor) {
            $ratingsReceived = Rating::with(['rater'])
                ->where('rated_id', $userable->id)
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

            $ratingsGiven = Rating::with(['rated'])
                ->where('rater_id', $userable->id)
                ->where('rater_type', 'App\Models\Instructor')
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
        }

        return Inertia::render('Ratings/Index', [
            'ratingsReceived' => $ratingsReceived,
            'ratingsGiven' => $ratingsGiven,
            'averageRating' => $userable->average_rating,
            'totalRatings' => $userable->total_ratings,
        ]);
    }

    /**
     * Store a new rating
     */
    public function store(Request $request)
    {
        Log::info('Rating store request data:', $request->all());

        try {
            $request->validate([
                'rated_id' => 'required',
                'rated_type' => 'required|in:App\Models\Student,App\Models\Instructor',
                'rating' => 'required|integer|between:1,5',
                'comment' => 'nullable|string|max:1000',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            return back()->withErrors(['error' => 'Please fill all required fields correctly.']);
        }

        $user = Auth::user();
        $userable = $user->userable;

        // Prevent organizations from creating ratings
        if ($userable instanceof \App\Models\Organization) {
            return back()->withErrors(['error' => 'Organizations cannot create ratings.']);
        }

        // Convert rated_id to integer
        $ratedId = (int) $request->rated_id;

        // Check if user has already rated this entity
        $existingRating = Rating::where('rater_id', $userable->id)
            ->where('rater_type', get_class($userable))
            ->where('rated_id', $ratedId)
            ->where('rated_type', $request->rated_type)
            ->first();

        if ($existingRating) {
            return back()->withErrors(['error' => 'You have already rated this person.']);
        }

        // Prevent self-rating
        if ($userable->id == $ratedId && get_class($userable) == $request->rated_type) {
            return back()->withErrors(['error' => 'You cannot rate yourself.']);
        }

        try {
            Rating::create([
                'rater_id' => $userable->id,
                'rater_type' => get_class($userable),
                'rated_id' => $ratedId,
                'rated_type' => $request->rated_type,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            return back()->with('success', 'Rating submitted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to submit rating. Please try again.']);
        }
    }

    /**
     * Update an existing rating
     */
    public function update(Request $request, Rating $rating)
    {
        try {
            $request->validate([
                'rating' => 'required|integer|between:1,5',
                'comment' => 'nullable|string|max:1000',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors(['error' => 'Please fill all required fields correctly.']);
        }

        $user = Auth::user();
        $userable = $user->userable;

        // Check if user owns this rating
        if ($rating->rater_id !== $userable->id || $rating->rater_type !== get_class($userable)) {
            return back()->withErrors(['error' => 'Unauthorized to update this rating.']);
        }

        try {
            $rating->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            return back()->with('success', 'Rating updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update rating. Please try again.']);
        }
    }

    /**
     * Delete a rating
     */
    public function destroy(Rating $rating)
    {
        $user = Auth::user();
        $userable = $user->userable;

        // Check if user owns this rating
        if ($rating->rater_id !== $userable->id || $rating->rater_type !== get_class($userable)) {
            return back()->withErrors(['error' => 'Unauthorized to delete this rating.']);
        }

        try {
            $rating->delete();
            return back()->with('success', 'Rating deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete rating. Please try again.']);
        }
    }

    /**
     * Get ratings for admin/club/organization view
     */
    public function adminIndex(Request $request)
    {
        $user = Auth::user();
        $userable = $user->userable;

        $query = Rating::with(['rater', 'rated']);

        // Filter based on user role
        if ($userable instanceof \App\Models\Club) {
            // For clubs, filter ratings where either the rater or rated entity belongs to this club
            $query->where(function ($q) use ($userable) {
                // Get ratings where the rater is a student or instructor from this club
                $q->where(function ($subQ) use ($userable) {
                    $subQ->where('rater_type', 'App\Models\Student')
                        ->whereHas('rater', function ($raterQ) use ($userable) {
                            $raterQ->where('club_id', $userable->id);
                        });
                })->orWhere(function ($subQ) use ($userable) {
                    $subQ->where('rater_type', 'App\Models\Instructor')
                        ->whereHas('rater', function ($raterQ) use ($userable) {
                            $raterQ->where('club_id', $userable->id);
                        });
                })->orWhere(function ($subQ) use ($userable) {
                    $subQ->where('rated_type', 'App\Models\Student')
                        ->whereHas('rated', function ($ratedQ) use ($userable) {
                            $ratedQ->where('club_id', $userable->id);
                        });
                })->orWhere(function ($subQ) use ($userable) {
                    $subQ->where('rated_type', 'App\Models\Instructor')
                        ->whereHas('rated', function ($ratedQ) use ($userable) {
                            $ratedQ->where('club_id', $userable->id);
                        });
                });
            });
        }

        $ratings = $query->latest()->get()->map(function ($rating) {
            return [
                'id' => $rating->id,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
                'rater_name' => $rating->rater->name ?? 'Unknown',
                'rater_type' => class_basename($rating->rater_type),
                'rated_name' => $rating->rated->name ?? 'Unknown',
                'rated_type' => class_basename($rating->rated_type),
            ];
        });



        return Inertia::render('Admin/Ratings/Index', [
            'ratings' => $ratings,
            'userType' => class_basename($userable),
        ]);
    }

    /**
     * Get ratings for organization view
     */
    public function organizationIndex(Request $request)
    {
        $user = Auth::user();
        $userable = $user->userable;

        if (!$userable instanceof \App\Models\Organization) {
            abort(403, 'Unauthorized');
        }

        $query = Rating::with(['rater', 'rated']);

        // For organizations, only show ratings of students and instructors (not clubs)
        // Organizations cannot give ratings, they can only view ratings
        $query->where(function ($q) use ($userable) {
            // Get ratings where the rated entity is a student or instructor from this organization
            $q->where(function ($subQ) use ($userable) {
                $subQ->where('rated_type', 'App\Models\Student')
                    ->whereHas('rated', function ($ratedQ) use ($userable) {
                        $ratedQ->where('organization_id', $userable->id);
                    });
            })->orWhere(function ($subQ) use ($userable) {
                $subQ->where('rated_type', 'App\Models\Instructor')
                    ->whereHas('rated', function ($ratedQ) use ($userable) {
                        $ratedQ->where('organization_id', $userable->id);
                    });
            });
        });

        $ratings = $query->latest()->get()->map(function ($rating) {
            return [
                'id' => $rating->id,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
                'rater_name' => $rating->rater->name ?? 'Unknown',
                'rater_type' => class_basename($rating->rater_type),
                'rated_name' => $rating->rated->name ?? 'Unknown',
                'rated_type' => class_basename($rating->rated_type),
            ];
        });

        // Calculate stats for organizations
        $stats = [
            'total_ratings' => $ratings->count(),
            'average_rating' => $ratings->avg('rating') ?? 0,
            'students_rated' => $ratings->where('rated_type', 'Student')->unique('rated_name')->count(),
            'instructors_rated' => $ratings->where('rated_type', 'Instructor')->unique('rated_name')->count(),
            'rating_distribution' => [
                '5_stars' => $ratings->where('rating', 5)->count(),
                '4_stars' => $ratings->where('rating', 4)->count(),
                '3_stars' => $ratings->where('rating', 3)->count(),
                '2_stars' => $ratings->where('rating', 2)->count(),
                '1_stars' => $ratings->where('rating', 1)->count(),
            ]
        ];

        return Inertia::render('Organization/Ratings/Index', [
            'ratings' => $ratings,
            'stats' => $stats,
        ]);
    }

    /**
     * Get ratings for club view
     */
    public function clubIndex(Request $request)
    {
        $user = Auth::user();
        $userable = $user->userable;

        if (!$userable instanceof \App\Models\Club) {
            abort(403, 'Unauthorized');
        }

        // Get all ratings first, then filter in PHP for better polymorphic handling
        $ratings = Rating::with(['rater', 'rated'])->latest()->get();

        // Filter ratings that belong to this club
        $clubRatings = $ratings->filter(function ($rating) use ($userable) {
            // Check if rater belongs to this club
            if ($rating->rater && in_array($rating->rater_type, ['App\Models\Student', 'App\Models\Instructor'])) {
                if ($rating->rater->club_id == $userable->id) {
                    return true;
                }
            }

            // Check if rated entity belongs to this club
            if ($rating->rated && in_array($rating->rated_type, ['App\Models\Student', 'App\Models\Instructor'])) {
                if ($rating->rated->club_id == $userable->id) {
                    return true;
                }
            }

            return false;
        });

        $ratings = $clubRatings->map(function ($rating) {
            return [
                'id' => $rating->id,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
                'rater_name' => $rating->rater->name ?? 'Unknown',
                'rater_type' => class_basename($rating->rater_type),
                'rated_name' => $rating->rated->name ?? 'Unknown',
                'rated_type' => class_basename($rating->rated_type),
            ];
        });

        // Calculate stats for clubs
        $stats = [
            'total_ratings' => $ratings->count(),
            'average_rating' => $ratings->avg('rating') ?? 0,
            'students_rated' => $ratings->where('rated_type', 'Student')->unique('rated_name')->count(),
            'instructors_rated' => $ratings->where('rated_type', 'Instructor')->unique('rated_name')->count(),
            'rating_distribution' => [
                '5_stars' => $ratings->where('rating', 5)->count(),
                '4_stars' => $ratings->where('rating', 4)->count(),
                '3_stars' => $ratings->where('rating', 3)->count(),
                '2_stars' => $ratings->where('rating', 2)->count(),
                '1_stars' => $ratings->where('rating', 1)->count(),
            ]
        ];

        return Inertia::render('Club/Ratings/Index', [
            'ratings' => $ratings,
            'stats' => $stats,
        ]);
    }
}