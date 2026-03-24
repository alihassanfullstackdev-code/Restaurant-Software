<?php

namespace App\Http\Controllers\PosTerminal;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ResturantTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'table']);

        if ($request->has('table_id') && $request->table_id !== null) {
            $currentTableId = $request->table_id;
            $table = ResturantTable::find($currentTableId);

            return $query->where(function ($q) use ($currentTableId, $table) {
                $q->where('table_id', $currentTableId);
                if ($table && $table->merge_id) {
                    $q->orWhere('table_id', $table->merge_id)
                        ->orWhere('merged_into_table_id', 'LIKE', "%$currentTableId%");
                }
            })
                ->whereIn('status', ['pending', 'held'])
                ->latest()
                ->first();
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Logic: table_id ko nullable kiya takeaway ke liye
            'table_id'     => 'nullable|exists:restaurant_tables,id',
            'cart'         => 'required|array',
            'total_amount' => 'required|numeric',
            'status'       => 'required|string', 
        ]);

        return DB::transaction(function () use ($request) {
            $currentId = $request->table_id;
            $order = null;
            $mergedString = null;
            $mergedIds = [];

            // --- 1. SEARCH FOR EXISTING ORDER (Only if table_id is provided) ---
            if ($currentId) {
                $table = ResturantTable::find($currentId);
                if ($table->merge_id) {
                    $mergedIds = ResturantTable::where('merge_id', $table->merge_id)
                        ->orWhere('id', $table->merge_id)
                        ->where('id', '!=', $currentId)
                        ->pluck('id')->toArray();
                }
                $mergedString = !empty($mergedIds) ? implode(',', $mergedIds) : null;

                $order = Order::where(function ($q) use ($currentId, $mergedIds) {
                    $q->where('table_id', $currentId);
                    if (!empty($mergedIds)) {
                        $q->orWhereIn('table_id', $mergedIds);
                    }
                })
                ->whereIn('status', ['pending', 'held'])
                ->first();
            }

            // --- 2. CREATE OR UPDATE LOGIC ---
            if ($order) {
                // UPDATE EXISTING
                $order->update([
                    'total_amount'         => $request->total_amount,
                    'status'               => $request->status,
                    'customer_name'        => $request->customer_name ?? $order->customer_name,
                    'served_by'            => $request->served_by ?? $order->served_by,
                    'payment_method'       => $request->payment_method ?? $order->payment_method,
                    'merged_into_table_id' => $mergedString,
                    'kitchen_status'       => 'sent', 
                ]);
                $order->items()->delete();
            } else {
                // NEW ORDER (Dine-in or Takeaway)
                $order = Order::create([
                    'table_id'             => $currentId,
                    'total_amount'         => $request->total_amount,
                    'status'               => $request->status,
                    'order_type'           => $currentId ? 'dine_in' : 'takeaway',
                    'customer_name'        => $request->customer_name ?? ($currentId ? 'Table Order' : 'Walking Customer'),
                    'served_by'            => $request->served_by ?? 'System',
                    'payment_method'       => $request->payment_method ?? 'cash',
                    'kitchen_status'       => 'sent', 
                    'kitchen_started_at'   => now(),
                    'merged_into_table_id' => $mergedString,
                    'is_split'             => 0,
                ]);
            }

            // --- 3. SAVE ITEMS ---
            foreach ($request->cart as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'] ?? $item['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);
            }

            // --- 4. TABLE STATUS (Only for Dine-in) ---
            if ($currentId) {
                $allAffectedTables = array_merge([$currentId], $mergedIds);
                if ($request->status === 'paid') {
                    ResturantTable::whereIn('id', $allAffectedTables)->update([
                        'status' => 'available',
                        'merge_id' => null
                    ]);
                    $order->update([
                        'kitchen_status'   => 'served',
                        'kitchen_ready_at' => $order->kitchen_ready_at ?? now(),
                    ]);
                } else {
                    ResturantTable::whereIn('id', $allAffectedTables)->update(['status' => 'occupied']);
                }
            }

            return response()->json($order->load('items.product'), 201);
        });
    }

    public function update(Request $request, Order $order)
    {
        return DB::transaction(function () use ($request, $order) {
            if ($request->has('kitchen_status')) {
                $order->update(['kitchen_status' => $request->kitchen_status]);
                if ($request->kitchen_status == 'ready') {
                    $order->update(['kitchen_ready_at' => now()]);
                }
            }

            $order->update($request->only(['status', 'total_amount', 'payment_method', 'customer_name', 'served_by']));

            if ($request->status === 'paid') {
                $tableIds = [$order->table_id];
                if ($order->merged_into_table_id) {
                    $tableIds = array_merge($tableIds, explode(',', $order->merged_into_table_id));
                }
                // Only attempt update if there are tables
                if ($order->table_id) {
                    ResturantTable::whereIn('id', $tableIds)->update(['status' => 'available', 'merge_id' => null]);
                }
                $order->update(['kitchen_status' => 'served']);
            }

            return response()->json($order->load('items.product'));
        });
    }

    public function show(Order $order)
    {
        return $order->load(['items.product', 'table']);
    }

    public function destroy(Order $order)
    {
        $order->items()->delete();
        $order->delete();
        return response()->json(['message' => 'Deleted']);
    }
}