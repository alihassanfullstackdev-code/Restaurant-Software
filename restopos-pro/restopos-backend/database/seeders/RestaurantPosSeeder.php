<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class RestaurantPosSeeder extends Seeder
{
    public function run()
    {
        // 15 Categories ki list
        $categories = [
            'Appetizers', 'Main Course', 'Beverages', 'Desserts', 
            'Deals', 'Fast Food', 'Chinese', 'Italian', 
            'BBQ', 'Seafood', 'Salads', 'Soups', 
            'Breakfast', 'Kids Menu', 'Steaks'
        ];

        foreach ($categories as $catName) {
            // Category Create karein
            $category = Category::create(['name' => $catName]);

            // Har category mein 1 sample product add karein
            Product::create([
                'name' => 'Sample ' . $catName . ' Item',
                'price' => rand(10, 50), // Random price
                'category_id' => $category->id,
                'is_deal' => ($catName === 'Deals') ? true : false,
            ]);
        }
    }
}