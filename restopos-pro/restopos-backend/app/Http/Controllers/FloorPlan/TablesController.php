<?php

namespace App\Http\Controllers\FloorPlan;

use App\Http\Controllers\Controller;
use App\Models\ResturantTable;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TablesController extends Controller
{
    public function index()
    {
        // 'floor' relationship ke sath tables mangwaein
        return response()->json(ResturantTable::with('floor')->get(), 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'table_number' => 'required',
            'seating_capacity' => 'required|integer',
            'floor_id' => 'required|exists:floors,id'
        ]);

        $table = ResturantTable::create($request->all());
        return response()->json($table, 201);
    }

    public function update(Request $request, string $id)
    {
        $table = ResturantTable::findOrFail($id);
        $table->update($request->only(['status', 'table_number', 'seating_capacity', 'floor_id']));
        return response()->json($table, 200);
    }

    // --- Special Method for "Move/Transfer" Button ---
    public function transferOrder(Request $request)
    {
        $request->validate([
            'from_table_id' => 'required|exists:restaurant_tables,id',
            'to_table_id' => 'required|exists:restaurant_tables,id',
        ]);

        return DB::transaction(function () use ($request) {
            $fromTable = ResturantTable::findOrFail($request->from_table_id);
            $toTable = ResturantTable::findOrFail($request->to_table_id);

            if ($toTable->status !== 'available') {
                return response()->json(['message' => 'Target table is not free!'], 400);
            }

            // 1. Order ko update karein
            $order = Order::where('table_id', $fromTable->id)->where('status', 'pending')->first();
            
            if ($order) {
                $order->update(['table_id' => $toTable->id]);
                
                // 2. Tables ka status switch karein
                $fromTable->update(['status' => 'available']);
                $toTable->update(['status' => 'occupied']);

                return response()->json(['message' => 'Order moved successfully']);
            }

            return response()->json(['message' => 'No active order found on source table'], 404);
        });
    }
}