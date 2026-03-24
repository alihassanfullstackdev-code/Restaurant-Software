<?php

namespace App\Http\Controllers\KitchenPOS;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class KitchenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'table'])
            ->whereIn('kitchen_status', ['sent', 'preparing', 'pending'])
            ->where('status', '!=', 'paid');

        // Filter Logic
        if ($request->has('type') && $request->type !== 'all') {
            // Schema ke mutabiq 'dine-in', 'takeaway', 'delivery' match honge
            $query->where('order_type', $request->type);
        }

        $orders = $query->orderBy('created_at', 'asc')->get();

        return response()->json($orders);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // KitchenController.php
    public function update(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);

            // Explicitly check karein ke data aa raha hai ya nahi
            $newStatus = $request->input('status', 'ready');

            $order->update([
                'kitchen_status' => $newStatus,
                'kitchen_ready_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'status' => $newStatus
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
