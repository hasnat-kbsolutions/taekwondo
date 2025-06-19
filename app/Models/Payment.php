<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'student_id',
        'amount',
        'method',         // e.g., 'cash' or 'stripe'
        'status',         // e.g., 'pending', 'paid'
        'payment_month',  // format: YYYY-MM
        'pay_at',         // date the payment was made
        'notes',
        'transaction_id', // optional: for Stripe or other gateways
    ];

    // Optional: define relationship to student
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
