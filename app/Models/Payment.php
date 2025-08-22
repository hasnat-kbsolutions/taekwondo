<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'student_id',
        'amount',
        'currency_code',
        'method',         // e.g., 'cash' or 'stripe'
        'status',         // e.g., 'pending', 'paid'
        'payment_month',  // format: YYYY-MM
        'pay_at',         // date the payment was made
        'notes',
        'transaction_id', // optional: for Stripe or other gateways
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Get the student for this payment
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the currency for this payment
     */
    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency_code', 'code');
    }

    /**
     * Get the formatted amount with currency
     */
    public function getFormattedAmountAttribute(): string
    {
        if ($this->currency) {
            return $this->currency->formatAmount($this->amount);
        }

        // Fallback to MYR if no currency is set
        return "RM " . number_format($this->amount, 2);
    }

    /**
     * Get the currency symbol
     */
    public function getCurrencySymbolAttribute(): string
    {
        return $this->currency ? $this->currency->symbol : 'RM';
    }
}
