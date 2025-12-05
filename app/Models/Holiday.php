<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'date',
        'description',
        'type',
        'is_recurring',
        'organization_id',
        'club_id',
        'is_active',
    ];

    protected $casts = [
        'date' => 'date',
        'is_recurring' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    /**
     * Get holidays for a specific month and context (organization/club)
     */
    public static function getForMonth($year, $month, $organizationId = null, $clubId = null)
    {
        $startDate = \Carbon\Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        return self::where('is_active', true)
            ->where(function ($query) use ($startDate, $endDate, $year) {
                // Non-recurring holidays in the date range
                $query->where(function ($q) use ($startDate, $endDate) {
                    $q->where('is_recurring', false)
                        ->whereBetween('date', [$startDate, $endDate]);
                });

                // Recurring holidays (match month and day, any year)
                $query->orWhere(function ($q) use ($startDate, $endDate) {
                    $q->where('is_recurring', true)
                        ->whereMonth('date', $startDate->month);
                });
            })
            ->where(function ($query) use ($organizationId, $clubId) {
                // Public holidays (no org/club)
                $query->where('type', 'public')
                    ->whereNull('organization_id')
                    ->whereNull('club_id');

                // Organization-specific holidays
                if ($organizationId) {
                    $query->orWhere(function ($q) use ($organizationId) {
                        $q->where('type', 'organization')
                            ->where('organization_id', $organizationId);
                    });
                }

                // Club-specific holidays
                if ($clubId) {
                    $query->orWhere(function ($q) use ($clubId) {
                        $q->where('type', 'club')
                            ->where('club_id', $clubId);
                    });
                }
            })
            ->get()
            ->mapWithKeys(function ($holiday) use ($year) {
                // For recurring holidays, use the current year
                $date = $holiday->is_recurring
                    ? \Carbon\Carbon::create($year, $holiday->date->month, $holiday->date->day)->format('Y-m-d')
                    : $holiday->date->format('Y-m-d');

                return [$date => [
                    'name' => $holiday->name,
                    'type' => $holiday->type,
                    'description' => $holiday->description,
                ]];
            });
    }
}
