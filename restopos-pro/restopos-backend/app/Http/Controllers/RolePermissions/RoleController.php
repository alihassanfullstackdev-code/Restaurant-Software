<?php

namespace App\Http\Controllers\RolePermissions;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    /**
     * React Table aur Permissions Matrix ke liye data fetch karna.
     */
    public function index()
    {
        $roles = Role::orderBy('id', 'desc')->get();
        $permissions = Permission::all();

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * UPDATED: Naya Role aur uski Permissions aik sath save karna.
     */
    public function store(Request $request)
    {
        $request->validate([
            'role_name'   => 'required|unique:roles,role_name|max:100',
            'permissions' => 'nullable|array', // Permissions array honi chahiye
            'permissions.*' => 'exists:permissions,id' // Har ID valid honi chahiye
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Role Create karein
                $role = Role::create([
                    'role_name' => strtoupper($request->role_name)
                ]);

                // 2. Agar permissions bheji gayi hain, toh sync karein
                if ($request->has('permissions')) {
                    $role->permissions()->attach($request->permissions);
                }

                return response()->json([
                    'message' => 'New authority established with permissions!',
                    'role' => $role->load('permissions')
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error establishing authority.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Specific Role ki permissions return karna (Auto-check logic).
     */
    public function show(string $id)
    {
        $role = Role::findOrFail($id);
        
        // Relationship use karte hue IDs nikalna zyada behtar hai
        $defaults = $role->permissions()->pluck('permissions.id');

        return response()->json($defaults);
    }

    /**
     * Role label update karna.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'role_name' => 'required|unique:roles,role_name,' . $id,
        ]);

        $role->update([
            'role_name' => strtoupper($request->role_name)
        ]);

        return response()->json(['message' => 'Authority label updated!']);
    }

    /**
     * Role delete karna.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        
        $role->delete();

        return response()->json(['message' => 'Role terminated successfully.']);
    }

    /**
     * Edit Modal ke liye permissions sync karna.
     */
    public function syncPermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $request->validate([
            'permissions' => 'required|array'
        ]);

        $role->permissions()->sync($request->permissions);

        return response()->json(['message' => 'Matrix policy updated!']);
    }
}