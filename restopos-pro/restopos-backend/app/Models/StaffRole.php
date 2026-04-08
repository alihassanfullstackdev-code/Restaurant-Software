<?php

namespace App\Models;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Model;

class StaffRole extends Model
{
    protected $table = 'staff_roles';
    protected $fillable = ['role_name'];

    public function staff()
    {
        return $this->hasMany(Staff::class, 'role_id');
    }
}
