<?php

namespace App\Http\Controllers\PosTerminal;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Image delete karne ke liye zaroori hai

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->latest();

        // Agar hum Menu Management (Backend) se call kar rahe hain
        if ($request->has('all_items')) {
            return response()->json($query->paginate(10)); 
        }

        // Agar POS Terminal (Frontend) se call kar rahe hain
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
            // Hum directly 'products' folder mein store kar rahe hain public disk par
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);
        return response()->json($product->load('category'), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        // React se aane wali boolean availability check
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
            // Purani image delete karna professional approach hai
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
        
        // Image bhi delete karein taake server par bojh na parre
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return response()->json(['message' => 'Product and Image Deleted Successfully']);
    }
}