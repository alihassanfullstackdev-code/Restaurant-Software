<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'price','is_deal','image', 'category_id', 'is_available'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
