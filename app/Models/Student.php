<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
class Student extends Model
{
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

    public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

}
