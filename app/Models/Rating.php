<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'rater_id',
        'rater_type',
        'rated_id',
        'rated_type',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the rater (who is giving the rating)
     */
    public function rater()
    {
        return $this->morphTo();
    }

    /**
     * Get the rated entity (who is being rated)
     */
    public function rated()
    {
        return $this->morphTo();
    }

    /**
     * Scope to get ratings given by a specific entity
     */
    public function scopeGivenBy($query, $raterId, $raterType)
    {
        return $query->where('rater_id', $raterId)->where('rater_type', $raterType);
    }

    /**
     * Scope to get ratings received by a specific entity
     */
    public function scopeReceivedBy($query, $ratedId, $ratedType)
    {
        return $query->where('rated_id', $ratedId)->where('rated_type', $ratedType);
    }

    /**
     * Get average rating for a specific entity
     */
    public static function getAverageRating($ratedId, $ratedType)
    {
        return static::receivedBy($ratedId, $ratedType)->avg('rating') ?? 0;
    }

    /**
     * Get total ratings count for a specific entity
     */
    public static function getTotalRatings($ratedId, $ratedType)
    {
        return static::receivedBy($ratedId, $ratedType)->count();
    }
}