<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'file', 'issued_at', 'notes'];
    protected $casts = [
        'issued_at' => 'date', // Cast issued_at as a Carbon date
    ];
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

}
