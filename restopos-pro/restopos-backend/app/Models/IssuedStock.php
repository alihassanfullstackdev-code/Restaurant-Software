<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Stock;
use App\Models\Category;
use App\Models\User;


class IssuedStock extends Model
{
    protected $table = 'issued_stocks';

    protected $fillable = [
        'stock_id',
        'issued_qty',
        'unit',
        'notes',
        // 'issued_by',
        'issued_at',
    ];
    protected $casts = [
        'issue_at' => 'datetime',
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
    public function issuedStocks()
    {
        return $this->hasMany(IssuedStock::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    // public function issuedBy()
    // {
    //     return $this->belongsTo(User::class);
    // }
}
