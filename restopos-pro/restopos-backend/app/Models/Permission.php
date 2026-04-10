<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = 'permissions';
    protected $fillable = ['permission_name', 'slug', 'module'];

    /**
     * Ye dekhne ke liye ke ye permission kin roles ke paas hai
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permission', 'permission_id', 'role_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
