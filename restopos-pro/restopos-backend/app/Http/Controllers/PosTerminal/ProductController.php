<?php

namespace App\Http\Controllers\PosTerminal;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware; // Ye line lazmi add karein
use Illuminate\Routing\Controllers\Middleware;    // Ye line lazmi add karein

class ProductController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            // Index aur Show ke liye 'view-menu' slug
            new Middleware('can:view-menu', only: ['index', 'show']),
            
            // Store (Add) ke liye 'add-menu' slug
            new Middleware('can:add-menu', only: ['store']),
            
            // Update (Edit) ke liye 'edit-menu' slug
            new Middleware('can:edit-menu', only: ['update']),
            
            // Destroy (Delete) ke liye 'delete-menu' slug
            new Middleware('can:delete-menu', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $query = Product::with('category')->latest();
        if ($request->has('all_items')) {
            return response()->json($query->paginate(10));
        }
        return response()->json($query->where('is_available', true)->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);
        return response()->json($product->load('category'), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($request->has('is_available')) {
            $product->update(['is_available' => $request->is_available]);
            return response()->json($product);
        }

        $data = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);
        return response()->json($product->load('category'));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return response()->json(['message' => 'Product and Image Deleted Successfully']);
    }
}