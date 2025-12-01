<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Student extends Model
{
    use Notifiable;

    protected $fillable = [
        'club_id',
        'organization_id',
        'uid',
        'code',
        'name',
        'surname',
        'nationality',
        'dob',
        'dod',
        'grade',
        'gender',
        'id_passport',
        'profile_image',
        'identification_document',
        'email',
        'phone',
        'city',
        'postal_code',
        'street',
        'country',
        'status',
    ];

    protected $casts = [
        'dob' => 'date',
        'dod' => 'date',
        'status' => 'boolean',
    ];

    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
    public function club()
    {
        return $this->belongsTo(Club::class);
    }
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function feePlan()
    {
        return $this->hasOne(StudentFeePlan::class);
    }

    public function gradeHistories()
    {
        return $this->hasMany(StudentGradeHistory::class)->orderBy('achieved_at', 'desc');
    }

    public function instructors()
    {
        return $this->belongsToMany(\App\Models\Instructor::class, 'instructor_student');
    }


    /**
     * Get ratings given by this student
     */
    public function ratingsGiven()
    {
        return $this->morphMany(Rating::class, 'rater');
    }

    /**
     * Get ratings received by this student
     */
    public function ratingsReceived()
    {
        return $this->morphMany(Rating::class, 'rated');
    }

    /**
     * Get average rating received by this student
     */
    public function getAverageRatingAttribute()
    {
        return Rating::getAverageRating($this->id, 'App\Models\Student');
    }

    /**
     * Get total ratings received by this student
     */
    public function getTotalRatingsAttribute()
    {
        return Rating::getTotalRatings($this->id, 'App\Models\Student');
    }

    /**
     * Boot the model and add event listeners
     */
    protected static function boot()
    {
        parent::boot();

        // Before saving, sanitize and validate data
        static::saving(function ($student) {
            // Sanitize string fields
            $student->name = trim($student->name);
            $student->surname = trim($student->surname ?? '');
            $student->email = strtolower(trim($student->email));
            $student->phone = trim($student->phone);
            $student->nationality = trim($student->nationality);
            $student->grade = trim($student->grade);
            $student->id_passport = trim($student->id_passport);
            $student->city = trim($student->city ?? '');
            $student->postal_code = trim($student->postal_code ?? '');
            $student->street = trim($student->street ?? '');
            $student->country = trim($student->country ?? '');

            // Ensure status is boolean
            $student->status = (bool) $student->status;
        });
    }

    /**
     * Get the student's full name
     */
    public function getFullNameAttribute()
    {
        return trim($this->name . ' ' . ($this->surname ?? ''));
    }

    /**
     * Get the student's age
     */
    public function getAgeAttribute()
    {
        if (!$this->dob) {
            return null;
        }

        return now()->diffInYears($this->dob);
    }

    /**
     * Check if student is active
     */
    public function isActive()
    {
        return $this->status === true;
    }

    /**
     * Check if student is underage (under 18)
     */
    public function isUnderage()
    {
        return $this->age < 18;
    }
}
