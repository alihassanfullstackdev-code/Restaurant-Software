<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Models\Supplier;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    /**
     * Display all stocks with relationships
     */
    public function index()
    {
        $stocks = Stock::with(['supplier:id,name', 'category:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($stocks);
    }

    /**
     * Store Function: Jab naya maal khareed kar aayein
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'category_id'     => 'required|exists:categories,id',
            'opening_quantity' => 'required|numeric|min:0', // Purana 'quantity'
            'unit'            => 'required|string',
            'min_stock_level' => 'required|numeric|min:0',
            'price_per_unit'  => 'nullable|numeric|min:0',
            'supplier_id'     => 'required|exists:suppliers,id',
            'expiry_date'     => 'nullable|date',
        ]);

        // Logic: Naye stock mein issued hamesha 0 hoga aur balance = opening
        $qty = $validated['opening_quantity'];
        $validated['issued_quantity'] = 0;
        $validated['current_balance'] = $qty;

        // Price calculation based on total opening quantity
        $validated['total_price'] = $qty * ($validated['price_per_unit'] ?? 0);

        // Status calculation ab current_balance par hogi
        $validated['status'] = $this->calculateStatus($qty, $validated['min_stock_level']);

        $stock = Stock::create($validated);

        return response()->json($stock->load(['supplier:id,name', 'category:id,name']), 201);
    }

    /**
     * Update Function: Data edit karne ke liye
     */
    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $data = $request->all();

        // Agar opening quantity change ho rahi hai to balance reset/update karein
        $opening = $request->opening_quantity ?? $stock->opening_quantity;
        $issued = $stock->issued_quantity; // Issued sirf issue controller se change hoga
        $price = $request->price_per_unit ?? $stock->price_per_unit;
        $min = $request->min_stock_level ?? $stock->min_stock_level;

        // Recalculate Balance: Opening - Already Issued
        $newBalance = $opening - $issued;

        $data['current_balance'] = $newBalance;
        $data['total_price'] = $newBalance * $price;
        $data['status'] = $this->calculateStatus($newBalance, $min);

        $stock->update($data);

        return response()->json($stock->load(['supplier:id,name', 'category:id,name']));
    }

    public function destroy($id){


        $stock = Stock::findOrFail($id);
        $stock->delete();
        return response()->json(['message' => 'Stock deleted successfully']);

    }
    /**
     * Helper: Status calculate karne ka logic (Base on Current Balance)
     */
    private function calculateStatus($currentBalance, $min)
    {
        if ($currentBalance <= 0) return 'out_of_stock';
        if ($currentBalance <= $min) return 'low_stock';
        return 'in_stock';
    }

    /**
     * Handle Transaction: In/Out for corrections
     */
    public function handleTransaction(Request $request, $id)
    {
        $request->validate([
            'type'     => 'required|in:in,out,waste',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $stock = Stock::findOrFail($id);

            if ($request->type === 'in') {
                // Stock mazeed khareeda gaya: opening barha dein
                $stock->opening_quantity += $request->quantity;
            } else {
                // Waste ya adjustment: opening se minus karein
                if ($stock->current_balance < $request->quantity) {
                    return response()->json(['message' => 'Insufficient balance'], 422);
                }
                $stock->opening_quantity -= $request->quantity;
            }

            // Always Sync Balance
            $stock->current_balance = $stock->opening_quantity - $stock->issued_quantity;
            $stock->total_price = $stock->current_balance * $stock->price_per_unit;
            $stock->status = $this->calculateStatus($stock->current_balance, $stock->min_stock_level);
            $stock->save();

            return response()->json($stock->load(['supplier:id,name', 'category:id,name']));
        });
    }

    // Dropdown helpers (No change needed)
    public function getSuppliers()
    {
        return response()->json(Supplier::select('id', 'name')->get());
    }
    public function getCategories()
    {
        return response()->json(Category::select('id', 'name')->get());
    }
}
