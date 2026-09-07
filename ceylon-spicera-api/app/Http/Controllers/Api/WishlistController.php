<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WishlistController extends Controller
{
    /**
     * The authenticated user's wishlisted products.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Wishlist::query()
            ->where('user_id', $request->user()->id)
            ->with(['product.category', 'product.sizes', 'product.images'])
            ->get()
            ->pluck('product');

        return ProductResource::collection($products);
    }

    /**
     * Add a product to the wishlist. Idempotent.
     */
    public function store(Request $request, Product $product): JsonResponse
    {
        $request->user()->wishlist()->firstOrCreate(['product_id' => $product->id]);

        return response()->json(['message' => 'Added to wishlist.']);
    }

    /**
     * Remove a product from the wishlist.
     */
    public function destroy(Request $request, Product $product): JsonResponse
    {
        $request->user()->wishlist()->where('product_id', $product->id)->delete();

        return response()->json(['message' => 'Removed from wishlist.']);
    }
}
