<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeType extends Model
{
    protected $fillable = [
        'name',
        'default_amount',
        'description',
    ];

    protected $casts = [
        'default_amount' => 'decimal:2',
    ];

    /**
     * Get all student fees of this type
     */
    public function studentFees(): HasMany
    {
        return $this->hasMany(StudentFee::class);
    }
}

