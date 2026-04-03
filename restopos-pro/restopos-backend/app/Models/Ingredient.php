<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\StockTransaction;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ingredient extends Model
{
    protected $fillable = ['name', 'category', 'unit', 'current_stock', 'min_stock_level'];

    // Accessor for UI: Check if stock is low
    protected $appends = ['is_low', 'stock_percentage'];

    public function getIsLowAttribute() {
        return $this->current_stock <= $this->min_stock_level;
    }

    public function getStockPercentageAttribute() {
        // Assuming 100 is max capacity for progress bar logic
        return min(($this->current_stock / 100) * 100, 100);
    }

    public function transactions(): HasMany {
        return $this->hasMany(StockTransaction::class);
    }
}
