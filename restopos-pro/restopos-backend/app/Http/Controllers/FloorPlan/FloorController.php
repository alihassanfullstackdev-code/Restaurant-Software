<?php

namespace App\Http\Controllers\FloorPlan;

use App\Http\Controllers\Controller;
use App\Models\Floor;
use Illuminate\Http\Request;

class FloorController extends Controller
{
    public function index()
    {
        // Saare floors return karein
        return response()->json(Floor::all(), 200);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:floors,name']);
        $floor = Floor::create($request->all());
        return response()->json($floor, 201);
    }

    public function destroy(string $id)
    {
        Floor::findOrFail($id)->delete();
        return response()->json(['message' => 'Floor deleted'], 200);
    }
}