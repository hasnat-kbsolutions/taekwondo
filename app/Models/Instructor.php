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

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }
}
