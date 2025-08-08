<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Student;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $request->validate([
            'rated_id' => 'required|integer',
            'rated_type' => 'required|in:App\Models\Student,App\Models\Instructor',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        $userable = $user->userable;

        // Check if user has already rated this entity
        $existingRating = Rating::where('rater_id', $userable->id)
            ->where('rater_type', get_class($userable))
            ->where('rated_id', $request->rated_id)
            ->where('rated_type', $request->rated_type)
            ->first();

        if ($existingRating) {
            return back()->withErrors(['rating' => 'You have already rated this person.']);
        }

        // Prevent self-rating
        if ($userable->id == $request->rated_id && get_class($userable) == $request->rated_type) {
            return back()->withErrors(['rating' => 'You cannot rate yourself.']);
        }

        Rating::create([
            'rater_id' => $userable->id,
            'rater_type' => get_class($userable),
            'rated_id' => $request->rated_id,
            'rated_type' => $request->rated_type,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Rating submitted successfully.');
    }

    /**
     * Update an existing rating
     */
    public function update(Request $request, Rating $rating)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        $userable = $user->userable;

        // Check if user owns this rating
        if ($rating->rater_id !== $userable->id || $rating->rater_type !== get_class($userable)) {
            abort(403, 'Unauthorized.');
        }

        $rating->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Rating updated successfully.');
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
            abort(403, 'Unauthorized.');
        }

        $rating->delete();

        return back()->with('success', 'Rating deleted successfully.');
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
            $query->whereHas('rated', function ($q) use ($userable) {
                $q->where('club_id', $userable->id);
            })->orWhereHas('rater', function ($q) use ($userable) {
                $q->where('club_id', $userable->id);
            });
        } elseif ($userable instanceof \App\Models\Organization) {
            $query->whereHas('rated', function ($q) use ($userable) {
                $q->where('organization_id', $userable->id);
            })->orWhereHas('rater', function ($q) use ($userable) {
                $q->where('organization_id', $userable->id);
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
        ]);
    }
}