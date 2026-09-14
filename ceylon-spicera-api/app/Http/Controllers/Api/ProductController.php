<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * List the active catalogue with search, filtering, sorting and pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::query()
            ->with(['category', 'sizes', 'images'])
            ->where('is_active', true);

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->string('category')->trim()->value()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($request->filled('min_price')) {
            $query->where('base_price_cents', '>=', (int) round($request->float('min_price') * 100));
        }

        if ($request->filled('max_price')) {
            $query->where('base_price_cents', '<=', (int) round($request->float('max_price') * 100));
        }

        match ($request->string('sort', 'featured')->value()) {
            'low' => $query->orderBy('base_price_cents', 'asc'),
            'high' => $query->orderBy('base_price_cents', 'desc'),
            'top' => $query->orderByDesc('rating')->orderByDesc('review_count'),
            'az' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('sort_order', 'asc'),
        };

        $perPage = min((int) $request->integer('per_page', 16), 100);

        return ProductResource::collection($query->paginate($perPage));
    }

    /**
     * Show a single active product with all sizes and images.
     */
    public function show(string $slug): ProductResource
    {
        $product = Product::query()
            ->with(['category', 'images'])
            ->with(['sizes' => fn ($q) => $q->orderBy('multiplier')])
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProductResource($product);
    }

    /**
     * The curated Best Sellers subset for the landing page.
     */
    public function featured(): AnonymousResourceCollection
    {
        $products = Product::query()
            ->with(['category', 'sizes', 'images'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->get();

        return ProductResource::collection($products);
    }
}
