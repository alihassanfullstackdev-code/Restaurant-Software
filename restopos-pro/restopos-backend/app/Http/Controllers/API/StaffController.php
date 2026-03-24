<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    /**
     * Saare staff members ki list dikhane ke liye
     */
    public function index()
    {
        return response()->json(Staff::orderBy('created_at', 'desc')->get());
    }

    /**
     * Naya staff member add karne ke liye
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string',
            'email' => 'required|email|unique:staff,email',
            'phone' => 'required|string',
            'status' => 'required|string',
            'performance' => 'nullable|numeric|between:0,5',
        ]);

        $member = Staff::create($validated);

        return response()->json([
            'message' => 'Staff Member added successfully!',
            'data' => $member
        ], 201);
    }

    /**
     * Kisi ek member ki details dekhne ke liye
     */
    public function show(Staff $staff)
    {
        return response()->json($staff);
    }

    /**
     * Staff ki info update karne ke liye
     */
    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'role' => 'string',
            'status' => 'string',
            'performance' => 'numeric|between:0,5',
        ]);

        $staff->update($validated);

        return response()->json([
            'message' => 'Staff updated!',
            'data' => $staff
        ]);
    }

    /**
     * Staff member delete karne ke liye
     */
    public function destroy(Staff $staff)
    {
        $staff->delete();
        return response()->json(['message' => 'Staff removed successfully']);
    }
}