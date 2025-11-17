<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @property-read \App\Models\User|null $user
 */
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
        'default_currency',
    ];

    protected $casts = [
        'status' => 'boolean',
        'notification_emails' => 'boolean',
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

    /**
     * Get the default currency for this club
     */
    public function defaultCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'default_currency', 'code');
    }

    /**
     * Get the currency symbol for this club
     */
    public function getCurrencySymbolAttribute(): string
    {
        return $this->defaultCurrency ? $this->defaultCurrency->symbol : 'RM';
    }

    /**
     * Get ratings given by this club
     */
    public function ratingsGiven(): MorphMany
    {
        return $this->morphMany(Rating::class, 'rater');
    }

    /**
     * Get ratings received by this club
     */
    public function ratingsReceived(): MorphMany
    {
        return $this->morphMany(Rating::class, 'rated');
    }

    /**
     * Get average rating received by this club
     */
    public function getAverageRatingAttribute()
    {
        return Rating::getAverageRating($this->id, 'App\Models\Club');
    }

    /**
     * Get total ratings received by this club
     */
    public function getTotalRatingsAttribute()
    {
        return Rating::getTotalRatings($this->id, 'App\Models\Club');
    }

    public function bankInformations()
    {
        return $this->morphMany(\App\Models\BankInformation::class, 'userable');
    }

    /**
     * Get all plans associated with this club
     */
    public function plans(): MorphMany
    {
        return $this->morphMany(Plan::class, 'planable');
    }

}
