<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankInformation extends Model
{
    protected $fillable = [
        'bank_name',
        'account_name',
        'account_number',
        'iban',
        'swift_code',
        'branch',
        'currency',
        'userable_type',
        'userable_id',
    ];

    /**
     * Polymorphic relation to any user type
     */
    public function userable()
    {
        return $this->morphTo();
    }
}
