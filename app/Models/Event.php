<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    protected $fillable = [
        'club_id',
        'organization_id',
        'created_by',
        'title',
        'description',
        'event_type',
        'event_date',
        'start_time',
        'end_time',
        'venue',
        'status',
        'is_public',
        'image',
        'document',
    ];

    protected $casts = [
        'event_date' => 'date',
        'is_public' => 'boolean',
    ];

    /**
     * Get the club that owns the event
     */
    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    /**
     * Get the organization that owns the event
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the user who created the event
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }



    /**
     * Get the event image URL
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        return asset('storage/' . $this->image);
    }

    /**
     * Check if event is upcoming
     */
    public function isUpcoming(): bool
    {
        return $this->status === 'upcoming' && $this->event_date >= now()->toDateString();
    }

    /**
     * Check if event is past
     */
    public function isPast(): bool
    {
        return $this->event_date < now()->toDateString();
    }

    /**
     * Get formatted event date and time
     */
    public function getFormattedDateTimeAttribute(): string
    {
        $dateStr = $this->event_date->format('M d, Y');

        if ($this->start_time) {
            $dateStr .= ' at ' . $this->start_time;
        }

        return $dateStr;
    }
}

