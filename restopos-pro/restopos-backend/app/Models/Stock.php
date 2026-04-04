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
        'opening_quantity', // Change Quantity to opening_quantity for clarity
        'issued_quantity',
        'current_balance',
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

    public function issuedStocks()
    {
        return $this->hasMany(IssuedStock::class);
    }
}
