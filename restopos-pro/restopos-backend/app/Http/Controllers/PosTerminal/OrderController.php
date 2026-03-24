<?php

namespace App\Http\Controllers\PosTerminal;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ResturantTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // 1. GET /api/orders
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'table']);

        if ($request->has('table_id')) {
            $currentTableId = $request->table_id;
            $table = ResturantTable::find($currentTableId);

            // Agar table merged hai, to order ya to is table par hoga ya uske partner table par
            return $query->where(function ($q) use ($currentTableId, $table) {
                $q->where('table_id', $currentTableId);
                if ($table && $table->merge_id) {
                    // Agar 7, 8 ke sath merge hai, to ho sakta hai order 8 par ho
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

    // 2. POST /api/orders (Store & Update Logic)
    // ... baki imports same rahenge

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id'     => 'required|exists:restaurant_tables,id',
            'cart'         => 'required|array',
            'total_amount' => 'required|numeric',
            'status'       => 'required|string', // 'held' or 'paid'
        ]);

        return DB::transaction(function () use ($request) {
            $currentId = $request->table_id;
            $table = ResturantTable::find($currentId);

            // --- MERGE LOGIC ---
            $mergedIds = [];
            if ($table->merge_id) {
                $mergedIds = ResturantTable::where('merge_id', $table->merge_id)
                    ->orWhere('id', $table->merge_id)
                    ->where('id', '!=', $currentId)
                    ->pluck('id')->toArray();
            }
            $mergedString = !empty($mergedIds) ? implode(',', $mergedIds) : null;

            // 1. Check existing active order (Dine-in only)
            $order = Order::where(function ($q) use ($currentId, $mergedIds) {
                $q->where('table_id', $currentId);
                if (!empty($mergedIds)) {
                    $q->orWhereIn('table_id', $mergedIds);
                }
            })
                ->whereIn('status', ['pending', 'held'])
                ->first();

            if ($order) {
                // --- UPDATE CASE (Jab items add ho rahe hon) ---
                $order->update([
                    'total_amount'         => $request->total_amount,
                    'status'               => $request->status,
                    'customer_name'        => $request->customer_name ?? $order->customer_name,
                    'served_by'            => $request->served_by ?? $order->served_by,
                    'payment_method'       => $request->payment_method ?? $order->payment_method,
                    'merged_into_table_id' => $mergedString,
                    'kitchen_status'       => 'sent', // Override 'pending' to 'sent'
                ]);

                // Items sync (purane delete karke naye add karein)
                $order->items()->delete();
            } else {
                // --- NEW STORE CASE ---
                $order = Order::create([
                    'table_id'             => $currentId,
                    'total_amount'         => $request->total_amount,
                    'status'               => $request->status,
                    'order_type'           => 'dine_in',
                    'customer_name'        => $request->customer_name ?? 'Table Order',
                    'served_by'            => $request->served_by ?? 'System',
                    'payment_method'       => $request->payment_method ?? 'cash',
                    'kitchen_status'       => 'sent', // Force status to 'sent'
                    'kitchen_started_at'   => now(), // Set the timestamp here
                    'merged_into_table_id' => $mergedString,
                    'is_split'             => 0,
                ]);
            }

            // 2. Items Save
            foreach ($request->cart as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'] ?? $item['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);
            }

            // 3. Table Status Management
            $allAffectedTables = array_merge([$currentId], $mergedIds);

            if ($request->status === 'paid') {
                // Release tables
                ResturantTable::whereIn('id', $allAffectedTables)->update([
                    'status' => 'available',
                    'merge_id' => null
                ]);
                // Finalize kitchen cycle
                $order->update([
                    'kitchen_status'   => 'served',
                    'kitchen_ready_at' => $order->kitchen_ready_at ?? now(),
                ]);
            } else {
                // Occupy tables
                ResturantTable::whereIn('id', $allAffectedTables)->update(['status' => 'occupied']);
            }

            return response()->json($order->load('items.product'), 201);
        });
    }

    // update method (for final checkout or status changes)
    public function update(Request $request, Order $order)
    {
        return DB::transaction(function () use ($request, $order) {
            // Agar order kitchen se ready ho raha hai
            if ($request->has('kitchen_status')) {
                $order->update(['kitchen_status' => $request->kitchen_status]);
                if ($request->kitchen_status == 'ready') {
                    $order->update(['kitchen_ready_at' => now()]);
                }
            }

            $order->update($request->only(['status', 'total_amount', 'payment_method', 'customer_name', 'served_by']));

            // Table release logic (Aapka existing logic)
            if ($request->status === 'paid') {
                $tableIds = [$order->table_id];
                if ($order->merged_into_table_id) {
                    $tableIds = array_merge($tableIds, explode(',', $order->merged_into_table_id));
                }
                ResturantTable::whereIn('id', $tableIds)->update(['status' => 'available', 'merge_id' => null]);
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
