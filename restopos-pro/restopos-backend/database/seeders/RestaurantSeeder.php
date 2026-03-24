<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Floor;
use App\Models\ResturantTable;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Floors
        $f1 = Floor::create(['name' => 'Main Dining']);
        $f2 = Floor::create(['name' => 'VIP Lounge']);

        // 2. Create Tables for Floor 1
        ResturantTable::create([
            'table_number' => '101',
            'seating_capacity' => 4,
            'status' => 'available',
            'floor_id' => $f1->id
        ]);

        ResturantTable::create([
            'table_number' => '102',
            'seating_capacity' => 2,
            'status' => 'occupied',
            'floor_id' => $f1->id
        ]);

        // 3. Create Tables for Floor 2
        ResturantTable::create([
            'table_number' => 'V-01',
            'seating_capacity' => 6,
            'status' => 'available',
            'floor_id' => $f2->id
        ]);
    }
}
