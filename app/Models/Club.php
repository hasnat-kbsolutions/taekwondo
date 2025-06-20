<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    protected $fillable = [
        'branch_id',
        'organization_id',
        'name',
        'tax_number',
        'invoice_prefix',
        'logo',
        'status',
        'email',
        'phone',
        'skype',
        'notification_emails',
        'website',
        'postal_code',
        'city',
        'street',
        'country',
    ];
}
