<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'base_amount',
        'currency_code',
        'is_active',
        'description',
        'planable_type',
        'planable_id',
    ];

    protected $casts = [
        'base_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the parent planable model (Club).
     */
    public function planable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the club that owns this plan.
     */
    public function club()
    {
        return $this->planable();
    }

    public function studentFeePlans(): HasMany
    {
        return $this->hasMany(StudentFeePlan::class);
    }
}


