<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentFeePlan extends Model
{
    protected $fillable = [
        'student_id',
        'plan_id',
        'custom_amount',
        'currency_code',
        'interval',
        'interval_count',
        'discount_type',
        'discount_value',
        'effective_from',
        'is_active',
        'notes',
        'next_period_start',
        'next_due_date',
    ];

    protected $casts = [
        'custom_amount' => 'decimal:2',
        'discount_value' => 'decimal:2',
        'effective_from' => 'date',
        'is_active' => 'boolean',
        'next_period_start' => 'date',
        'next_due_date' => 'date',
    ];

    protected $appends = [
        'base_amount',
        'effective_amount',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function getBaseAmountAttribute(): float
    {
        $base = $this->custom_amount ?? $this->plan?->base_amount ?? 0;
        return (float) $base;
    }

    public function getEffectiveAmountAttribute(): float
    {
        $base = $this->base_amount;
        if ($this->discount_type === 'percent' && $this->discount_value > 0) {
            $discount = $base * ((float) $this->discount_value / 100.0);
        } elseif ($this->discount_type === 'fixed' && $this->discount_value > 0) {
            $discount = (float) $this->discount_value;
        } else {
            $discount = 0.0;
        }
        $amount = max($base - $discount, 0);
        return (float) $amount;
    }
}


