<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    protected $fillable = [
        'name',
        'organization_id',
        'tax_number',
        'invoice_prefix',
        'logo', // or 'logo_image' — pick one to match your migration
        'phone',
        'skype',
        'notification_emails',
        'website',
        'postal_code',
        'city',
        'street',
        'country',
        'status',
    ];



    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
    public function clubs()
    {
        return $this->hasMany(Club::class);
    }

    public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function instructors()
    {
        return $this->hasMany(Instructor::class);
    }

    public function supporters()
    {
        return $this->hasMany(Supporter::class);
    }

}
