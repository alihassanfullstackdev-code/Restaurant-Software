<?php

namespace App\Http\Controllers\FloorPlan;

use App\Http\Controllers\Controller;
use App\Models\ResturantTable;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableOperationController extends Controller
{
    // --- TRANSFER ---
    public function transfer(Request $request)
    {
        // ... validation same rahegi ...

        return DB::transaction(function () use ($request) {
            $fromTable = ResturantTable::findOrFail($request->from_table_id);
            $toTable   = ResturantTable::findOrFail($request->to_table_id);

            if ($toTable->status !== 'available') {
                return response()->json(['message' => 'Target table is already occupied!'], 422);
            }

            // 1. Order ko pehle pakrein
            $order = Order::where('table_id', $fromTable->id)
                ->whereIn('status', ['pending', 'held'])
                ->first();

            if ($order) {
                // 2. Order ko nayi table par transfer karein aur track rakhein
                $order->update([
                    'table_id' => $toTable->id,
                    'transferred_from_table_id' => $fromTable->id
                ]);

                // 3. Status update karein
                $toTable->update(['status' => 'occupied', 'merge_id' => $fromTable->merge_id]);
                $fromTable->update(['status' => 'available', 'merge_id' => null]);
            } else {
                // Agar order nahi bhi hai, tab bhi status switch kar dein (Optional)
                $toTable->update(['status' => $fromTable->status]);
                $fromTable->update(['status' => 'available']);
            }

            return response()->json(['message' => 'Table transferred successfully']);
        });
    }

    // --- MERGE (Updated with Security Logic) ---
    public function merge(Request $request)
    {
        $request->validate([
            'primary_table_id'   => 'required|exists:restaurant_tables,id',
            'secondary_table_id' => 'required|exists:restaurant_tables,id',
        ]);

        return DB::transaction(function () use ($request) {
            $t1 = ResturantTable::findOrFail($request->primary_table_id);
            $t2 = ResturantTable::findOrFail($request->secondary_table_id);

            if ($t1->merge_id !== null || $t2->merge_id !== null) {
                return response()->json(['message' => 'Already merged!'], 422);
            }

            $groupId = $t1->id;

            // Force both to occupied since merge = dine-in start
            $t1->update(['merge_id' => $groupId, 'status' => 'occupied']);
            $t2->update(['merge_id' => $groupId, 'status' => 'occupied']);

            // Agar secondary table ka pehle se koi order tha, usey primary par shift karein
            Order::where('table_id', $t2->id)
                ->whereIn('status', ['pending', 'held'])
                ->update([
                    'table_id' => $t1->id,
                    'merged_into_table_id' => $t1->id
                ]);

            return response()->json(['message' => 'Tables merged and marked as occupied']);
        });
    }

    // --- UNMERGE ---
    public function unmerge(Request $request)
    {
        $request->validate(['table_id' => 'required|exists:restaurant_tables,id']);

        return DB::transaction(function () use ($request) {
            $table = ResturantTable::findOrFail($request->table_id);

            if ($table->merge_id === null) {
                return response()->json(['message' => 'Table is not merged'], 422);
            }

            $groupId = $table->merge_id;
            $groupTables = ResturantTable::where('merge_id', $groupId)->orWhere('id', $groupId)->get();
            $activeOrder = Order::where('table_id', $groupId)->where('status', 'pending')->first();

            foreach ($groupTables as $t) {
                $newStatus = ($activeOrder && $t->id === $groupId) ? 'occupied' : 'available';
                $t->update(['merge_id' => null, 'status' => $newStatus]);
            }

            return response()->json(['message' => 'Table unmerged']);
        });
    }
    // --- SPLIT BILL (Equal Split) ---
    public function split(Request $request, $orderId)
    {
        $request->validate([
            'parts' => 'required|integer|min:2',
        ]);

        return DB::transaction(function () use ($request, $orderId) {
            $order = Order::findOrFail($orderId);

            // Basic Equal Split Logic
            $totalAmount = $order->total_amount;
            $amountPerPerson = $totalAmount / $request->parts;

            $order->update(['is_split' => true, 'split_count' => $request->parts]);

            return response()->json([
                'message' => 'Bill split calculated successfully',
                'data' => [
                    'original_total' => $totalAmount,
                    'parts' => $request->parts,
                    'per_person' => round($amountPerPerson, 2)
                ]
            ]);
        });
    }
}
