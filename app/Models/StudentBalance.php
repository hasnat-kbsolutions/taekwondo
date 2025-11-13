<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class StudentBalance extends Model
{
    protected $fillable = [
        'student_id',
        'total_due',
        'total_paid',
        'balance',
    ];

    protected $casts = [
        'total_due' => 'decimal:2',
        'total_paid' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    /**
     * Get the student for this balance
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Update balance for a student
     */
    public static function updateBalance(int $studentId): void
    {
        $totalDue = StudentFee::where('student_id', $studentId)
            ->sum(DB::raw('amount + fine - discount'));

        $totalPaid = Payment::whereHas('studentFee', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })
            ->where('status', 'successful')
            ->sum('amount');

        $balance = $totalDue - $totalPaid;

        self::updateOrCreate(
            ['student_id' => $studentId],
            [
                'total_due' => $totalDue,
                'total_paid' => $totalPaid,
                'balance' => $balance,
            ]
        );
    }
}

