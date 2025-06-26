<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'organization_id',
        'name',
        'email',
        'country',
        'city',
        'street',
        'postal_code',
        'logo_image',
        'status',
    ];


    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
    
    public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }

    public function clubs()
    {
        return $this->hasMany(Club::class);
    }

    public function supporters()
    {
        return $this->hasMany(Supporter::class);
    }

}
