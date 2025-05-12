<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supporter extends Model
{
    protected $casts = [
        'status' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        'organization_id',
        'club_id',
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
}
