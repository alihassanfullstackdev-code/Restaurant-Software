<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Super Admin Account
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@restopos.com',
            'password' => Hash::make('admin123'), // Login password: admin123
        ]);

        // 2. Manager Account (Optional testing ke liye)
        User::create([
            'name' => 'Manager Account',
            'email' => 'manager@restopos.com',
            'password' => Hash::make('password123'),
        ]);
    }
}