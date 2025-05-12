<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = ['name', 'description', 'longitude', 'latitude'];

    public function images(): HasMany
    {
        return $this->hasMany(LocationImage::class);
    }
}