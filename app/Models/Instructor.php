<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{

    protected $fillable = [
        'name',
        'ic_number',
        'email',
        'address',
        'mobile',
        'grade',
        'profile_picture',
        'organization_id',
        'club_id',
    ];

    public function certifications()
    {
        return $this->morphMany(Certification::class, 'certifiable');
    }


    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function students()
    {
        return $this->belongsToMany(\App\Models\Student::class, 'instructor_student');
    }

    /**
     * Get ratings given by this instructor
     */
    public function ratingsGiven()
    {
        return $this->morphMany(Rating::class, 'rater');
    }

    /**
     * Get ratings received by this instructor
     */
    public function ratingsReceived()
    {
        return $this->morphMany(Rating::class, 'rated');
    }

    /**
     * Get average rating received by this instructor
     */
    public function getAverageRatingAttribute()
    {
        return Rating::getAverageRating($this->id, 'App\Models\Instructor');
    }

    /**
     * Get total ratings received by this instructor
     */
    public function getTotalRatingsAttribute()
    {
        return Rating::getTotalRatings($this->id, 'App\Models\Instructor');
    }
}
