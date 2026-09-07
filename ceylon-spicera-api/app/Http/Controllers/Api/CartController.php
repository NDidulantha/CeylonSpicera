<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\QuoteCartRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ShippingRate;
use App\Services\CartService;
use App\Services\PricingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly PricingService $pricingService,
    ) {}

    /**
     * The current guest or user cart. Never creates a cart on a plain read.
     */
    public function index(Request $request): CartResource|JsonResponse
    {
        $cart = $this->cartService->findCart($request->user(), $request->header('X-Guest-Token'));

        if (! $cart) {
            return response()->json([
                'data' => ['id' => null, 'items' => [], 'item_count' => 0, 'subtotal_cents' => 0],
            ]);
        }

        return new CartResource($cart->load('items.product', 'items.productSize'));
    }

    /**
     * Add a line to the cart, summing onto a matching line already there
     * (clamped to 99) rather than creating a duplicate.
     */
    public function store(AddCartItemRequest $request): CartResource
    {
        $cart = $this->cartService->findOrCreateCart($request->user(), $request->header('X-Guest-Token'));

        abort_if(! $cart, 422, 'A guest token or an authenticated session is required.');

        $item = $cart->items()
            ->where('product_id', $request->integer('product_id'))
            ->where('product_size_id', $request->integer('product_size_id'))
            ->first();

        if ($item) {
            $item->update(['quantity' => min(99, $item->quantity + $request->integer('quantity'))]);
        } else {
            $cart->items()->create([
                'product_id' => $request->integer('product_id'),
                'product_size_id' => $request->integer('product_size_id'),
                'quantity' => $request->integer('quantity'),
            ]);
        }

        return new CartResource($cart->load('items.product', 'items.productSize'));
    }

    /**
     * Update a line's quantity. A quantity of 0 removes it.
     */
    public function update(UpdateCartItemRequest $request, CartItem $item): CartResource
    {
        $cart = $this->resolveOwningCart($request, $item);

        if ($request->integer('quantity') === 0) {
            $item->delete();
        } else {
            $item->update(['quantity' => $request->integer('quantity')]);
        }

        return new CartResource($cart->load('items.product', 'items.productSize'));
    }

    /**
     * Remove a line from the cart.
     */
    public function destroy(Request $request, CartItem $item): CartResource
    {
        $cart = $this->resolveOwningCart($request, $item);

        $item->delete();

        return new CartResource($cart->load('items.product', 'items.productSize'));
    }

    /**
     * Merge the guest cart identified by X-Guest-Token into the
     * authenticated user's cart. Safe to call more than once.
     */
    public function merge(Request $request): CartResource
    {
        $this->cartService->mergeGuestCartIntoUser($request->user(), $request->header('X-Guest-Token'));

        $cart = $this->cartService->findOrCreateCart($request->user(), null);

        return new CartResource($cart->load('items.product', 'items.productSize'));
    }

    /**
     * The full PricingService breakdown for the current cart under a given
     * shipping rate, destination country, gift-wrap flag and promo code.
     */
    public function quote(QuoteCartRequest $request): JsonResponse
    {
        $cart = $this->cartService->findCart($request->user(), $request->header('X-Guest-Token'));
        $items = $cart ? $cart->items()->with('productSize')->get() : collect();

        if ($items->isEmpty()) {
            throw ValidationException::withMessages(['items' => ['Your cart is empty.']]);
        }

        $shippingRate = ShippingRate::query()->where('key', $request->string('shipping_key')->value())->firstOrFail();

        $subtotal = $items->sum(fn ($item) => $item->productSize->price_cents * $item->quantity);
        $promo = $this->pricingService->findPromoOrFail($request->input('promo_code'));

        if ($promo) {
            $this->pricingService->assertPromoEligible($promo, $subtotal, $request->user());
        }

        $breakdown = $this->pricingService->calculate(
            $items,
            $promo,
            $shippingRate,
            $request->boolean('gift_wrap'),
            $request->string('country')->value(),
        );

        return response()->json([
            'data' => [
                ...$breakdown,
                'currency' => 'USD',
                'shipping_rate' => [
                    'key' => $shippingRate->key,
                    'name' => $shippingRate->name,
                    'eta' => $shippingRate->eta,
                ],
                'promo_code' => $promo ? ['code' => $promo->code, 'type' => $promo->type, 'value' => $promo->value] : null,
            ],
        ]);
    }

    /**
     * Resolve the cart that owns the given item for the current requester,
     * aborting with 404 if the item does not belong to it.
     */
    private function resolveOwningCart(Request $request, CartItem $item): Cart
    {
        $cart = $this->cartService->findCart($request->user(), $request->header('X-Guest-Token'));

        abort_if(! $cart || $item->cart_id !== $cart->id, 404);

        return $cart;
    }
}
