<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentFee extends Model
{
    protected $fillable = [
        'student_id',
        'fee_type_id',
        'month',
        'amount',
        'discount',
        'fine',
        'paid_amount',
        'status',
        'due_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'fine' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    /**
     * Get the student for this fee
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the fee type for this fee
     */
    public function feeType(): BelongsTo
    {
        return $this->belongsTo(FeeType::class);
    }

    /**
     * Get all payments for this student fee
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Calculate the total amount due (amount + fine - discount)
     */
    public function getTotalDueAttribute(): float
    {
        return (float) ($this->amount + $this->fine - $this->discount);
    }

    /**
     * Calculate the remaining balance
     */
    public function getRemainingBalanceAttribute(): float
    {
        return (float) ($this->total_due - $this->paid_amount);
    }

    /**
     * Update the paid amount and status based on payments
     */
    public function updatePaymentStatus(): void
    {
        $totalPaid = $this->payments()
            ->where('status', 'successful')
            ->sum('amount');

        $this->paid_amount = $totalPaid;
        $totalDue = $this->total_due;

        if ($totalPaid >= $totalDue) {
            $this->status = 'paid';
        } elseif ($totalPaid > 0) {
            $this->status = 'partial';
        } else {
            $this->status = 'pending';
        }

        $this->save();
    }

    /**
     * Boot method to handle student fee changes
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($studentFee) {
            // Update student balance when fee is created or updated
            StudentBalance::updateBalance($studentFee->student_id);
        });

        static::deleted(function ($studentFee) {
            // Update student balance when fee is deleted
            StudentBalance::updateBalance($studentFee->student_id);
        });
    }
}

