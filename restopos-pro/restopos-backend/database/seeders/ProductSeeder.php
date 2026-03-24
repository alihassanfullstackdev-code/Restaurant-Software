<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Classic Beef Burger',
                'category' => 'Main Course',
                'price' => 12.99,
                'is_available' => true,
            ],
            [
                'name' => 'Mozzarella Sticks',
                'category' => 'Appetizers',
                'price' => 8.50,
                'is_available' => true,
            ],
            [
                'name' => 'Iced Caramel Latte',
                'category' => 'Beverages',
                'price' => 4.50,
                'is_available' => true,
            ],
            [
                'name' => 'Chocolate Lava Cake',
                'category' => 'Desserts',
                'price' => 7.99,
                'is_available' => true,
            ],
            [
                'name' => 'Grilled Chicken Salad',
                'category' => 'Main Course',
                'price' => 10.00,
                'is_available' => true,
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}