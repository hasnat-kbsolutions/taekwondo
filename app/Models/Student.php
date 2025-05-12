<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'company_id',
        'organization_id',
        'club_id',
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
        'id_passport_image',
        'signature_image',
        'email',
        'phone',
        'skype',
        'website',
        'city',
        'postal_code',
        'street',
        'country',
        'status',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

}
