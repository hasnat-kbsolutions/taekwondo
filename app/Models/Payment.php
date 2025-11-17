<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    protected $fillable = [
        'student_id',
        'month',
        'amount',
        'method',
        'status',
        'transaction_id',
        'pay_at',
        'due_date',
        'notes',
        'currency_code',
        'bank_information',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'pay_at' => 'date',
        'due_date' => 'date',
        'bank_information' => 'array',
    ];

    /**
     * Student for this payment
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
        return "RM " . number_format((float) $this->amount, 2);
    }

    /**
     * Get the currency symbol
     */
    public function getCurrencySymbolAttribute(): string
    {
        return $this->currency ? $this->currency->symbol : 'RM';
    }

    /**
     * Get attachment for this payment (one-to-one)
     */
    public function attachment()
    {
        return $this->hasOne(PaymentAttachment::class);
    }

    /**
     * Check if payment has an attachment
     */
    public function hasAttachment(): bool
    {
        return $this->attachment()->exists();
    }

    // Removed model events that depended on StudentFee/StudentBalance
}
