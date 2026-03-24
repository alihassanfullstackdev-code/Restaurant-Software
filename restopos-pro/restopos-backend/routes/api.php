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
use App\Http\Controllers\API\StaffController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('staff', StaffController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('floors', FloorController::class);
    Route::apiResource('table', TableController::class);
    Route::apiResource('tables', TablesController::class);
    Route::post('tables/transfer', [TableOperationController::class, 'transfer']);
    Route::post('tables/merge', [TableOperationController::class, 'merge']);
    Route::post('tables/unmerge', [TableOperationController::class, 'unmerge']);
    Route::post('orders/{id}/split', [TableOperationController::class, 'split']);
});
// Protected Routes (Login hona zaroori hai)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);
});
