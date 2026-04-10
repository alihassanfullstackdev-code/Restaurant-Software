<?php

namespace App\Models;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    Protected $table = 'role_permission';
    Protected $fillable = ['role_id', 'permission_id'];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function permission()
    {
        return $this->belongsTo(Permission::class, 'permission_id');
    }
}
