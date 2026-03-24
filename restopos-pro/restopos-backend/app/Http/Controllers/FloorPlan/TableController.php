<?php

namespace App\Http\Controllers\FloorPlan;

use App\Http\Controllers\Controller;
use App\Models\ResturantTable;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index()
    {
        return response()->json(ResturantTable::with('floor')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_number'     => 'required|string|unique:restaurant_tables,table_number',
            'floor_id'         => 'required|exists:floors,id',
            'seating_capacity' => 'required|integer|min:1',
            'status'           => 'required|string|in:available,occupied,dirty,reserved'
        ]);

        $table = ResturantTable::create($validated);
        return response()->json(['message' => 'Table Created', 'data' => $table], 201);
    }

    public function update(Request $request, $id)
    {
        $table = ResturantTable::findOrFail($id);

        $validated = $request->validate([
            'table_number'     => 'sometimes|string',
            'floor_id'         => 'sometimes|exists:floors,id',
            'status'           => 'sometimes|string|in:available,occupied,dirty,reserved',
            'seating_capacity' => 'sometimes|integer'
        ]);

        $table->update($validated);

        return response()->json([
            'message' => 'Table updated',
            'data' => $table->fresh()
        ]);
    }

    public function destroy($id)
    {
        $table = ResturantTable::findOrFail($id);
        if ($table->status === 'occupied') {
            return response()->json(['message' => 'Occupied table delete nahi ho sakti!'], 422);
        }
        $table->delete();
        return response()->json(['message' => 'Table deleted']);
    }
}