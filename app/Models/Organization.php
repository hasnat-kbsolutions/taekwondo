<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'status',
    ];


    public function clubs()
    {
        return $this->hasMany(Club::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function supporters()
    {
        return $this->hasMany(Supporter::class);
    }

}
