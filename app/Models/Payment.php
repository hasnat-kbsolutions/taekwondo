<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    protected $fillable = [
        'student_fee_id',
        'amount',
        'method',
        'status',
        'transaction_id',
        'pay_at',
        'notes',
        'currency_code',
        'bank_information',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'pay_at' => 'date',
        'bank_information' => 'array',
    ];

    /**
     * Get the student fee for this payment
     */
    public function studentFee(): BelongsTo
    {
        return $this->belongsTo(StudentFee::class);
    }

    /**
     * Get student via studentFee relationship (accessor)
     */
    public function getStudentAttribute()
    {
        return $this->studentFee?->student;
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

    /**
     * Boot method to handle payment status changes
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($payment) {
            if ($payment->studentFee) {
                $payment->studentFee->updatePaymentStatus();

                // Update student balance
                if ($payment->studentFee->student) {
                    StudentBalance::updateBalance($payment->studentFee->student_id);
                }
            }
        });

        static::deleted(function ($payment) {
            if ($payment->studentFee) {
                $payment->studentFee->updatePaymentStatus();

                // Update student balance
                if ($payment->studentFee->student) {
                    StudentBalance::updateBalance($payment->studentFee->student_id);
                }
            }
        });
    }
}
