<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'website',
        'skype',
        'city',
        'country',
        'street',
        'postal_code',
        'status',
    ];





    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function supporters()
    {
        return $this->hasMany(Supporter::class);
    }
    public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }

    public function clubs()
    {
        return $this->hasMany(Club::class);
    }
}
