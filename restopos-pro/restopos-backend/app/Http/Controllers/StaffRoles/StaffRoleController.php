<?php
namespace App\Http\Controllers\StaffRoles;

use App\Http\Controllers\Controller;
use App\Models\StaffRole;
use Illuminate\Http\Request;

class StaffRoleController extends Controller
{
    public function index()
    {
        return response()->json(StaffRole::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_name' => 'required|string|unique:staff_roles,role_name',
        ]);

        $role = StaffRole::create($validated);
        return response()->json(['message' => 'Role created', 'data' => $role], 201);
    }

    public function update(Request $request, StaffRole $staffRole)
    {
        $validated = $request->validate([
            'role_name' => 'required|string|unique:staff_roles,role_name,' . $staffRole->id,
        ]);

        $staffRole->update($validated);
        return response()->json(['message' => 'Role updated', 'data' => $staffRole]);
    }

    public function destroy(StaffRole $staffRole)
    {
        // Check if role has assigned staff before deleting
        if ($staffRole->staff()->count() > 0) {
            return response()->json(['message' => 'Cannot delete role with assigned staff'], 422);
        }

        $staffRole->delete();
        return response()->json(['message' => 'Role deleted']);
    }
}