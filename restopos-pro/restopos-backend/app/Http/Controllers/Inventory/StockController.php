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
        // Category aur Supplier ka data sath bhej rahe hain (Eager Loading)
        $stocks = Stock::with(['supplier:id,name', 'category:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($stocks);
    }

    /**
     * Store Function: Data save karne ke liye
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'category_id'     => 'required|exists:categories,id',
            'quantity'        => 'required|numeric|min:0',
            'unit'            => 'required|string',
            'min_stock_level' => 'required|numeric|min:0',
            'price_per_unit'  => 'nullable|numeric|min:0',
            'supplier_id'     => 'required|exists:suppliers,id',
            'expiry_date'     => 'nullable|date',
        ]);

        // Backend Calculation (Security ke liye)
        $validated['total_price'] = $validated['quantity'] * ($validated['price_per_unit'] ?? 0);
        $validated['status'] = $this->calculateStatus($validated['quantity'], $validated['min_stock_level']);

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

        // Recalculate if values change
        $qty = $request->quantity ?? $stock->quantity;
        $price = $request->price_per_unit ?? $stock->price_per_unit;
        $min = $request->min_stock_level ?? $stock->min_stock_level;

        $data['total_price'] = $qty * $price;
        $data['status'] = $this->calculateStatus($qty, $min);

        $stock->update($data);

        return response()->json($stock->load(['supplier:id,name', 'category:id,name']));
    }

    /**
     * Helper: Status calculate karne ka logic
     */
    private function calculateStatus($qty, $min)
    {
        if ($qty <= 0) return 'out_of_stock';
        if ($qty <= $min) return 'low_stock';
        return 'in_stock';
    }

    /**
     * Dropdown Data: React Modal ke liye alag routes
     */
    public function getSuppliers()
    {
        return response()->json(Supplier::select('id', 'name')->get());
    }

    public function getCategories()
    {
        return response()->json(Category::select('id', 'name')->get());
    }
    public function handleTransaction(Request $request, $id)
    {
        $request->validate([
            'type'     => 'required|in:in,out,waste',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $stock = Stock::findOrFail($id);

            if ($request->type === 'in') {
                $stock->quantity += $request->quantity;
            } else {
                if ($stock->quantity < $request->quantity) {
                    return response()->json(['message' => 'Insufficient stock'], 422);
                }
                $stock->quantity -= $request->quantity;
            }

            $stock->total_price = $stock->quantity * $stock->price_per_unit;
            $stock->status = $this->calculateStatus($stock->quantity, $stock->min_stock_level);
            $stock->save();

            return response()->json($stock->load(['supplier:id,name', 'category:id,name']));
        });
    }
}
