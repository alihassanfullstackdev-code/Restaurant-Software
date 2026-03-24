<?php

namespace App\Http\Controllers\PosTerminal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product; // Ensure you have this
use App\Models\Order;   // Order model
use App\Models\OrderItem; // Order items model
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    /**
     * Frontend ke liye saare products fetch karna.
     */
    public function index()
    {
        // Frontend ki categories ke mutabik products bhej raha hai
        return response()->json(Product::where('is_available', true)->get());
    }

    /**
     * Checkout (Pay) button click hone par order save karna.
     */
    public function store(Request $request)
    {
        // Validation: Frontend se 'cart' aur 'total' lazmi aana chahiye
        $request->validate([
            'cart' => 'required|array',
            'total' => 'required|numeric'
        ]);

        try {
            // DB Transaction taake agar aik item save na ho to pura order cancel ho jaye
            return DB::transaction(function () use ($request) {
                $auth_id = Auth::id();
                // 1. Order save karein
                $order = Order::create([
                    'user_id' => $auth_id, // Logged in user ya default
                    'total_amount' => $request->total,
                    'status' => 'paid', // Kyunke 'Pay' button se call ho raha hai
                ]);

                // 2. Cart ke har item ko OrderItems table mein save karein
                foreach ($request->cart as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }

                return response()->json([
                    'message' => 'Order placed successfully!',
                    'order_id' => $order->id
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json(['error' => 'Order failed: ' . $e->getMessage()], 500);
        }
    }
}