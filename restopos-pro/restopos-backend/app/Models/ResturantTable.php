<?php

namespace App\Models;
use App\Models\Floor;
use Illuminate\Database\Eloquent\Model;

class ResturantTable extends Model
{
    protected $table = 'restaurant_tables';
    protected $fillable = [ 'table_number', 'seating_capacity', 'status','floor_id','merge_id'];

    public function floor()
    {
        return $this->belongsTo(Floor::class, 'floor_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'table_id');
    }
}
