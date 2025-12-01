<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grade extends Model
{
    protected $fillable = [
        'name',
        'level',
        'color',
        'order',
        'is_active',
        'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the student grade histories for this grade
     */
    public function studentGradeHistories(): HasMany
    {
        return $this->hasMany(StudentGradeHistory::class);
    }

    /**
     * Get all students with this grade
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_grade_histories', 'grade_id', 'student_id');
    }

    /**
     * Scope to get only active grades
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
