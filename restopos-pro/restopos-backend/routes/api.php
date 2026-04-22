<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ApiAuthController;
use App\Http\Controllers\PosTerminal\ProductController;
use App\Http\Controllers\PosTerminal\CategoryController;
use App\Http\Controllers\PosTerminal\OrderController;
use App\Http\Controllers\FloorPlan\FloorController;
use App\Http\Controllers\FloorPlan\TablesController;
use App\Http\Controllers\FloorPlan\TableController;
use App\Http\Controllers\FloorPlan\TableOperationController;
use App\Http\Controllers\KitchenPOS\KitchenController;
use App\Http\Controllers\KitchenPOS\KitchenHistoryController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Supplier\SupplierController;
use App\Http\Controllers\Inventory\StockController;
use App\Http\Controllers\Inventory\IssuedInventoryController;
use App\Http\Controllers\StaffRoles\StaffController;
use App\Http\Controllers\StaffRoles\StaffRoleController;
use App\Http\Controllers\RolePermissions\RolePermissionController;
use App\Http\Controllers\RolePermissions\RoleController;
use App\Http\Controllers\RolePermissions\UserController;

// --- Public Routes ---
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

// --- Protected Routes (Sanctum Group) ---
Route::middleware('auth:sanctum')->group(function () {

    // User info fetching (With Roles & Permissions)
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['role.permissions', 'permissions']);
    });

    Route::post('/logout', [ApiAuthController::class, 'logout']);

    // --- 1. Menu & Products ---
    Route::middleware('can:view-menu')->group(function () {
        Route::apiResource('products', ProductController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::get('get-categories', [StockController::class, 'getCategories']);
    });

    // --- 2. POS Terminal (Only for Cashiers/Waiters) ---
    Route::middleware('can:access-pos')->group(function () {
        Route::apiResource('orders', OrderController::class);
    });

    // --- 3. Kitchen OS (For Chefs) ---
    // 'view-kitchen' permission ke routes
    Route::middleware('can:view-kitchen')->group(function () {
        Route::get('kitchen-orders', [KitchenController::class, 'index']);
        Route::get('kitchen-history', [KitchenHistoryController::class, 'index']);
        Route::get('kitchen-stock', [IssuedInventoryController::class, 'getKitchenInventory']);
        
        // Status updates (Like marking as 'Ready') - 'manage-kitchen-orders' check
        Route::middleware('can:manage-kitchen-orders')->group(function () {
            Route::put('kitchen-orders/{id}', [KitchenController::class, 'update']);
            Route::put('kitchen-history/{id}', [KitchenHistoryController::class, 'update']); // For Re-opening
        });
    });

    // --- 4. Floor Plan Access ---
    Route::middleware('can:view-floor-plan')->group(function () {
        Route::get('floors', [FloorController::class, 'index']);
        Route::get('tables', [TablesController::class, 'index']);
        Route::get('table/{id}', [TableController::class, 'show']);
    });

    // --- 5. Table Operations (Transfer/Merge/Split) ---
    Route::middleware('can:create-order')->group(function () {
        Route::post('orders', [OrderController::class, 'store']);
        Route::post('tables/transfer', [TableOperationController::class, 'transfer']);
        Route::post('tables/merge', [TableOperationController::class, 'merge']);
        Route::post('tables/unmerge', [TableOperationController::class, 'unmerge']);
        Route::post('orders/{id}/split', [TableOperationController::class, 'split']);
    });

    // --- 6. Table & Floor Management (Admin/Manager) ---
    Route::middleware('can:manage-tables')->group(function () {
        Route::post('tables', [TableController::class, 'store']);
        Route::put('tables/{id}', [TableController::class, 'update']);
        Route::delete('tables/{id}', [TableController::class, 'destroy']);
        
        Route::post('floors', [FloorController::class, 'store']);
        Route::put('floors/{id}', [FloorController::class, 'update']);
        Route::delete('floors/{id}', [FloorController::class, 'destroy']);
    });

    // --- 7. Inventory Management ---
    Route::middleware('can:view-inventory')->group(function () {
        Route::apiResource('inventory', InventoryController::class);
        Route::apiResource('stocks', StockController::class);
        Route::apiResource('suppliers', SupplierController::class);
        Route::get('get-suppliers', [StockController::class, 'getSuppliers']);
        Route::post('stocks/{id}/transaction', [StockController::class, 'handleTransaction']);
        Route::post('inventory/issued', [IssuedInventoryController::class, 'issueStock']);
        Route::get('inventory/issued', [IssuedInventoryController::class, 'getIssueHistory']);
    });

    // --- 8. Staff & Security Management ---
    Route::middleware('can:view-staff')->group(function () {
        Route::apiResource('staff', StaffController::class);
        Route::apiResource('staff-roles', StaffRoleController::class);
    });

    Route::middleware('can:manage-permissions')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('permissions', RolePermissionController::class);
        Route::apiResource('role-permissions', RolePermissionController::class);

        Route::get('role-permissions-list', [RoleController::class, 'index']); 
        Route::get('roles/{id}/defaults', [RoleController::class, 'show']);
        Route::post('roles/{id}/sync', [RoleController::class, 'syncPermissions']);
        Route::post('role-permissions/sync', [RolePermissionController::class, 'store']);
    });

});