<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Currency extends Model
{
    protected $fillable = [
        'code',
        'name',
        'symbol',
        'decimal_places',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'decimal_places' => 'integer',
    ];

    /**
     * Get all payments using this currency
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'currency_code', 'code');
    }

    /**
     * Get all organizations using this currency as default
     */
    public function organizations(): HasMany
    {
        return $this->hasMany(Organization::class, 'default_currency', 'code');
    }

    /**
     * Get all clubs using this currency as default
     */
    public function clubs(): HasMany
    {
        return $this->hasMany(Club::class, 'default_currency', 'code');
    }

    /**
     * Format amount with currency symbol and proper decimal places
     */
    public function formatAmount(float $amount): string
    {
        $formattedAmount = number_format($amount, $this->decimal_places);

        // Malaysian Ringgit format: RM 100.00
        if ($this->code === 'MYR') {
            return "RM " . $formattedAmount;
        }

        // Other currencies: $100.00, €100.00, etc.
        return $this->symbol . $formattedAmount;
    }

    /**
     * Get the default currency (MYR)
     */
    public static function getDefault(): self
    {
        return static::where('is_default', true)->first() ?? static::where('code', 'MYR')->first();
    }

    /**
     * Get all active currencies
     */
    public static function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('is_active', true)->orderBy('code')->get();
    }

    /**
     * Scope for active currencies
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for default currency
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
