<?php

namespace App\Models;
use App\Models\ResturantTable;
use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
    protected $fillable = ['name'];

    public function tables()
    {
        return $this->hasMany(ResturantTable::class, 'floor_id');
    }
}
