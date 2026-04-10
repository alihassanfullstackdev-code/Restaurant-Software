<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public $timestamps = false;
    protected $table = 'roles';
    protected $fillable = ['role_name'];

    /**
     * Role ki saari permissions hasil karne ke liye
     */
    public function permissions()
    {
        // 1st param: Model, 2nd: Pivot table name, 3rd: current model key, 4th: target model key
        return $this->belongsToMany(Permission::class, 'role_permission', 'role_id', 'permission_id');
    }

    public function user()
    {
        return $this->belongsToMany(User::class, 'user_id');
    }
}