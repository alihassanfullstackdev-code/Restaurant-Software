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
     * UPDATED: Roles ke sath unki permissions load karna (Eager Loading).
     */
    public function index()
    {
        // .with('permissions') lazmi hai taake React ko har role ki default permissions mil sakein
        $roles = Role::with('permissions')->orderBy('id', 'desc')->get();
        $permissions = Permission::all();

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Naya Role aur uski Permissions aik sath save karna.
     */
    public function store(Request $request)
    {
        $request->validate([
            'role_name'   => 'required|unique:roles,role_name|max:100',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $role = Role::create([
                    'role_name' => strtoupper($request->role_name)
                ]);

                if ($request->has('permissions')) {
                    // attach() ya sync() dono use ho sakte hain new role ke liye
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
     * Specific Role ki permissions IDs return karna.
     */
    public function show(string $id)
    {
        $role = Role::findOrFail($id);
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
        // Cascade delete agar set nahi hai to manually permissions detach karein
        $role->permissions()->detach();
        $role->delete();

        return response()->json(['message' => 'Role terminated successfully.']);
    }

    /**
     * Matrix/Permissions sync karna.
     */
    public function syncPermissions(Request $request, $id)
{
    $role = Role::findOrFail($id);
    
    // Matrix se sirf selected IDs ka array aana chahiye: [1, 2, 5]
    $role->permissions()->sync($request->permissions); 

    return response()->json(['message' => 'Permissions updated successfully!']);
}
}