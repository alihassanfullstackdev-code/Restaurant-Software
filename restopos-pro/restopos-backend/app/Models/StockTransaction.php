<?php

namespace App\Models;

use App\Models\Ingredient;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockTransaction extends Model
{
    protected $fillable = ['ingredient_id', 'type', 'quantity', 'reason'];

    public function ingredient(): BelongsTo {
        return $this->belongsTo(Ingredient::class);
    }
}
