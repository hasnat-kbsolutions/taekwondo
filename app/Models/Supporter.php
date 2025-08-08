<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supporter extends Model
{




    public function certifications()
    {
        return $this->morphMany(Certification::class, 'certifiable');
    }
    protected $casts = [
        'status' => 'boolean',
    ];

    protected $fillable = [
        'club_id',
        'organization_id',

        'name',
        'surename',
        'gender',
        'email',
        'phone',
        'country',
        'type',
        'status',
        'profile_image',
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
