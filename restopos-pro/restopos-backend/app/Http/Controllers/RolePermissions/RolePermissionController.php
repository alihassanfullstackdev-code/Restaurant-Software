<?php

namespace App\Http\Controllers\RolePermissions;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use App\Models\RolePermission; // Aapka pivot model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller
{
    /**
     * React UI ke liye Roles, Permissions aur current Matrix load karna
     */
    public function index()
    {
        // 1. Saare Roles uthao
        $roles = Role::all(['id', 'role_name']);

        // 2. Saari Permissions module ke hisaab se group karke fetch karein
        $permissions = Permission::orderBy('module')->get(['id', 'permission_name', 'slug', 'module']);

        // 3. Current Matrix: Kaunse role ke paas kaunsi permission hai
        // Hum RolePermission model use karke pluck kar rahe hain
        $matrix = [];
        foreach ($roles as $role) {
            $matrix[$role->id] = RolePermission::where('role_id', $role->id)
                                               ->pluck('permission_id')
                                               ->toArray();
        }

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions,
            'matrix' => $matrix
        ]);
    }

    /**
     * Matrix ko save (sync) karna
     */
    public function store(Request $request)
    {
        $request->validate([
            'matrix' => 'required|array'
        ]);

        try {
            DB::beginTransaction();

            // Har role ke liye purani permissions delete karke nayi insert karni hain
            foreach ($request->matrix as $roleId => $permissionIds) {
                
                // 1. Pehle purani saari permissions urao is role ki
                RolePermission::where('role_id', $roleId)->delete();

                // 2. Nayi permissions insert karo (agar array khali nahi hai)
                if (!empty($permissionIds)) {
                    $dataToInsert = [];
                    foreach ($permissionIds as $pId) {
                        $dataToInsert[] = [
                            'role_id' => $roleId,
                            'permission_id' => $pId,
                        ];
                    }
                    // Bulk Insert for performance
                    RolePermission::insert($dataToInsert);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Security settings updated successfully!']);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Database error: ' . $e->getMessage()], 500);
        }
    }
}