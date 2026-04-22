<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\StockTransaction;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class InventoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('can:view-inventory', only: ['index', 'show']),
            new Middleware('can:add-inventory', only: ['store']),
            new Middleware('can:edit-inventory', only: ['update']),
            new Middleware('can:delete-inventory', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventory = Ingredient::all();

        // Hum transactions bhi bhejenge taake sidebar fill ho saky
        $history = StockTransaction::with('ingredient')->latest()->take(10)->get();

        return response()->json([
            'inventory' => $inventory,
            'history' => $history,
            'suppliers' => [] // Abhi ke liye empty, baad mein Supplier model se le ayenge
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'unit' => 'required|string',
            'min_stock_level' => 'required|integer',
        ]);

        $ingredient = Ingredient::create($validated);

        return response()->json([
            'message' => 'Item added to inventory',
            'data' => $ingredient
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Ingredient::destroy($id);
        return response()->json(['message' => 'Item deleted']);
    }
}
