<?php

namespace App\Http\Controllers\KitchenPOS;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class KitchenHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $orders = Order::with(['items.product', 'table'])
            ->where('kitchen_status', 'ready')
            ->orderBy('kitchen_ready_at', 'desc')
            ->paginate(12); // History ke liye pagination zaroori hai

        // Agar Resource use kar rahe hain:
        // return KitchenOrderResource::collection($orders);

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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $order = Order::findOrFail($id);

            // Agar frontend se 'reopen' ka signal aaye
            if ($request->has('reopen')) {
                $order->update([
                    'kitchen_status' => 'preparing',
                    'kitchen_ready_at' => null
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Order moved back to kitchen'
                ]);
            }

            return response()->json(['success' => false, 'message' => 'No action specified'], 400);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Single order detail preview ke liye (GET /api/kitchen-history/{id})
     */
    public function show(string $id)
    {
        return Order::with(['items.product', 'table'])->findOrFail($id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
