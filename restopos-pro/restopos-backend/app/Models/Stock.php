<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Supplier;
use App\Models\Category;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable = [
        'name',
        'category_id',
        'quantity',
        'unit',
        'min_stock_level',
        'price_per_unit',
        'total_price',
        'supplier_id',
        'expiry_date',
        'status'
    ];

    // Relationship with Supplier
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
