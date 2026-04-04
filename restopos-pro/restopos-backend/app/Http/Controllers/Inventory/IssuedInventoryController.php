<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\IssuedStock;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IssuedInventoryController extends Controller
{
    public function issueStock(Request $request)
    {
        // 1. Validation
        $request->validate([
            'stock_id' => 'required|exists:stocks,id',
            'quantity' => 'required|numeric|min:0.01', // Support for decimals like 0.5kg
            'notes'    => 'nullable|string|max:1000',
        ]);

        try {
            return DB::transaction(function () use ($request) {

                // Hum 'Stock' model se item pakrenge
                $stockItem = Stock::findOrFail($request->stock_id);

                // 2. Logic Check: Ab hum 'current_balance' check karenge
                if ($stockItem->current_balance < $request->quantity) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "Store mein sirf {$stockItem->current_balance} {$stockItem->unit} bacha hai!"
                    ], 422);
                }

                // 3. Step 1: Stock Table Update (Professional Way)
                // Hum direct quantity minus nahi karenge, balkay 'issued_quantity' barhayenge
                $stockItem->issued_quantity += $request->quantity;

                // Recalculate Current Balance (Opening - Issued)
                $stockItem->current_balance = $stockItem->opening_quantity - $stockItem->issued_quantity;

                // Status recalculate karein (Low stock alert ke liye)
                if ($stockItem->current_balance <= 0) {
                    $stockItem->status = 'out_of_stock';
                } elseif ($stockItem->current_balance <= $stockItem->min_stock_level) {
                    $stockItem->status = 'low_stock';
                } else {
                    $stockItem->status = 'in_stock';
                }

                $stockItem->save();

                // 4. Step 2: IssuedStock History Table mein entry
                $issuedEntry = IssuedStock::create([
                    'stock_id'   => $request->stock_id,
                    'issued_qty' => $request->quantity,
                    'unit'       => $stockItem->unit,
                    'notes'      => $request->notes,
                    'issued_at'  => Carbon::now(),
                ]);

                return response()->json([
                    'status'  => 'success',
                    'message' => 'Stock successfully issued to kitchen!',
                    'data'    => $issuedEntry->load('stock') // Full data wapis bhej rahe hain
                ], 200);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kuch masla hua: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * History API: Ismein Stock ka naam bhi include hoga
     */
    public function getIssueHistory()
    {
        $history = IssuedStock::with('stock:id,name,unit')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($history);
    }

    public function getKitchenInventory()
    {
        // 1. Sirf wo stocks uthayenge jo issue ho chuke hain
        // 2. withSum automatically 'issued_stocks_sum_issued_qty' column bana dega
        $kitchenStock = Stock::has('issuedStocks')
            ->with(['category:id,name'])
            ->withSum('issuedStocks as total_issued', 'issued_qty')
            ->get()
            ->map(function ($item) {
                return [
                    'stock_id'       => $item->id,
                    'item_name'      => $item->name,
                    'category_name'  => $item->category->name ?? 'General',
                    'unit'           => $item->unit,
                    'total_qty'      => $item->total_issued,
                    // Latest issue date nikalne ke liye relation ka use
                    'last_issued_at' => $item->issuedStocks()->latest('issued_at')->first()->issued_at ?? null,
                ];
            });

        return response()->json($kitchenStock);
    }
}
