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
        'gender',
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


}
