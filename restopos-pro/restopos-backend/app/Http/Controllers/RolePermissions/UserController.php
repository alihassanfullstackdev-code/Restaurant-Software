<?php

namespace App\Http\Controllers\RolePermissions;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Staff list with their Roles and specific Permissions.
     */
    public function index()
    {
        // Yahan 'role.permissions' load karna zaroori hai taake front-end ko pata chale 
        // ke kis role ki default permissions kya hain.
        $users = User::with(['role.permissions', 'permissions'])->orderBy('id', 'desc')->get();
        return response()->json($users);
    }

    /**
     * Store new User and sync custom permissions matrix.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'required|array|min:1', // Error agar koi permission select nahi ki
        ], [
            'role_id.required' => 'Please select a primary role first!',
            'permissions.min' => 'At least one permission must be granted to authorize personnel.'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role_id' => $request->role_id,
                ]);

                // Matrix ki saari permissions user_permissions table mein sync hongi
                if ($request->has('permissions')) {
                    $user->permissions()->sync($request->permissions);
                }

                return response()->json([
                    'message' => 'Personnel Authorized Successfully! ✅',
                    'user' => $user->load('role', 'permissions')
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Critical Error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update existing staff and their permission matrix.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'required|array|min:1',
        ]);

        try {
            return DB::transaction(function () use ($request, $user) {
                $user->update([
                    'name' => $request->name,
                    'email' => $request->email,
                    'role_id' => $request->role_id,
                ]);

                // Agar password field bhari hai to update karein
                if ($request->filled('password')) {
                    $user->update(['password' => Hash::make($request->password)]);
                }

                // Override matrix sync
                $user->permissions()->sync($request->permissions);

                return response()->json(['message' => 'Identity Updated Successfully!']);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Update Failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove staff access.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete(); // user_permissions automatically delete ho jayengi agar cascade set hai
        return response()->json(['message' => 'Identity Terminated.']);
    }
}