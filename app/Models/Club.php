<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Club extends Model
{
    protected $fillable = [
        'name',
        'organization_id',
        'tax_number',
        'invoice_prefix',
        'logo', // or 'logo_image' — pick one to match your migration
        'phone',
        'notification_emails',
        'website',
        'postal_code',
        'city',
        'street',
        'country',
        'status',
    ];



    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function user(): MorphOne
    {
        return $this->morphOne(User::class, 'userable');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function instructors(): HasMany
    {
        return $this->hasMany(Instructor::class);
    }

    public function supporters(): HasMany
    {
        return $this->hasMany(Supporter::class);
    }

}
