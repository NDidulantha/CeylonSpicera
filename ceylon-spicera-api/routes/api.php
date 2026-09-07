<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:register');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);

Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/items', [CartController::class, 'store']);
    Route::patch('/items/{item}', [CartController::class, 'update']);
    Route::delete('/items/{item}', [CartController::class, 'destroy']);
    Route::post('/merge', [CartController::class, 'merge'])->middleware('auth:sanctum');
    Route::get('/quote', [CartController::class, 'quote']);
});

Route::prefix('wishlist')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [WishlistController::class, 'index']);
    Route::post('/{product}', [WishlistController::class, 'store']);
    Route::delete('/{product}', [WishlistController::class, 'destroy']);
});

Route::prefix('orders')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{reference}', [OrderController::class, 'show']);
});

Route::prefix('payments/payhere')->group(function () {
    Route::post('/initiate', [PaymentController::class, 'initiate'])->middleware('auth:sanctum');
    Route::post('/notify', [PaymentController::class, 'notify']);
    Route::get('/return', [PaymentController::class, 'returnRedirect']);
});
