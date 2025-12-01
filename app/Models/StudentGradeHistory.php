<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentGradeHistory extends Model
{
    protected $fillable = [
        'student_id',
        'grade_name',
        'achieved_at',
        'duration_days',
        'notes',
    ];

    protected $casts = [
        'achieved_at' => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function gradeLevel(): BelongsTo
    {
        return $this->belongsTo(GradeLevel::class, 'grade_name', 'name');
    }
}
