<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample Data for your Dashboard
        Staff::create([
            'name' => 'Sarah Jenkins',
            'role' => 'Head Chef',
            'email' => 'sarah.j@restopos.com',
            'phone' => '+1 234 567 890',
            'status' => 'On Shift',
            'performance' => 4.8
        ]);

        Staff::create([
            'name' => 'Marcus Chen',
            'role' => 'Floor Manager',
            'email' => 'marcus.c@restopos.com',
            'phone' => '+1 234 567 891',
            'status' => 'Off Duty',
            'performance' => 4.5
        ]);
    }
}
