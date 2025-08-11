<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'website',
        'city',
        'country',
        'street',
        'postal_code',
        'status',
    ];

    public function instructors(): HasMany
    {
        return $this->hasMany(\App\Models\Instructor::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(\App\Models\Student::class);
    }

    public function clubs(): HasMany
    {
        return $this->hasMany(\App\Models\Club::class);
    }

    public function supporters(): HasMany
    {
        return $this->hasMany(Supporter::class);
    }

    public function user(): MorphOne
    {
        return $this->morphOne(User::class, 'userable');
    }

    /**
     * Get ratings given by this organization
     */
    public function ratingsGiven(): MorphMany
    {
        return $this->morphMany(Rating::class, 'rater');
    }

    /**
     * Get ratings received by this organization
     */
    public function ratingsReceived(): MorphMany
    {
        return $this->morphMany(Rating::class, 'rated');
    }

    /**
     * Get average rating received by this organization
     */
    public function getAverageRatingAttribute()
    {
        return Rating::getAverageRating($this->id, 'App\Models\Organization');
    }

    /**
     * Get total ratings received by this organization
     */
    public function getTotalRatingsAttribute()
    {
        return Rating::getTotalRatings($this->id, 'App\Models\Organization');
    }
}
