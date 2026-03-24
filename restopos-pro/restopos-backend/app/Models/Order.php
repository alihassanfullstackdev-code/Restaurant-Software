<?php

namespace App\Models;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    const STATUS_PAID = 'paid';
    const STATUS_PENDING = 'pending';
    const STATUS_HELD = 'held';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'table_id',
        'total_amount',
        'status',
        'customer_name',
        'served_by',
        'kitchen_status',
        'kitchen_started_at',
        'kitchen_ready_at',
        'payment_method',
        'order_type',
        'is_split',
        'split_count',
        'transferred_from_table_id',
        'merged_into_table_id',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function table()
    {
        return $this->belongsTo(ResturantTable::class, 'table_id');
    }
}
