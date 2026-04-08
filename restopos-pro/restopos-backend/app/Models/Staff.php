<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $fillable = [
        'role_id',
        'full_name',
        'email',
        'phone_number',
        'cnic_number',
        'address',
        'profile_image',
        'cnic_front_image',
        'cnic_back_image',
        'status',
        'joining_date',
        'emergency_contact',
        'salary'
    ];

    // Dates ko auto-cast karein taake Carbon use ho sakay
    protected $casts = [
        'joining_date' => 'date',
        'salary' => 'float',
    ];

    public function role()
    {
        return $this->belongsTo(StaffRole::class, 'role_id');
    }
}
