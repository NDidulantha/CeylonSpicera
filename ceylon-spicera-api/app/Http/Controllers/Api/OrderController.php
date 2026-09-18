<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\ShippingRate;
use App\Services\CartService;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly PricingService $pricingService,
    ) {}

    /**
     * The authenticated user's orders, most recent first.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = $request->user()->orders()->latest('placed_at')->paginate(15);

        return OrderResource::collection($orders);
    }

    /**
     * A single order belonging to the authenticated user.
     */
    public function show(Request $request, string $reference): OrderResource
    {
        $order = $request->user()->orders()
            ->with('items')
            ->where('reference', $reference)
            ->firstOrFail();

        return new OrderResource($order);
    }

    /**
     * Create a pending order from the authenticated user's cart. All money
     * is recomputed from the database inside a transaction; nothing here
     * trusts a price, subtotal, or total sent by the client.
     */
    public function store(CreateOrderRequest $request): OrderResource
    {
        $user = $request->user();
        $cart = $this->cartService->findCart($user, null);
        $items = $cart ? $cart->items()->with(['product', 'productSize'])->get() : collect();

        if ($items->isEmpty()) {
            throw ValidationException::withMessages(['items' => ['Your cart is empty.']]);
        }

        foreach ($items as $item) {
            $this->assertPurchasable($item);
        }

        $shippingRate = ShippingRate::query()->where('key', $request->string('shipping_key')->value())->firstOrFail();
        $subtotal = $items->sum(fn ($item) => $item->productSize->price_cents * $item->quantity);
        $promo = $this->pricingService->findPromoOrFail($request->input('promo_code'));

        if ($promo) {
            $this->pricingService->assertPromoEligible($promo, $subtotal, $user);
        }

        $shippingAddress = $request->input('shipping_address');
        $billingAddress = $request->input('billing_address');

        $breakdown = $this->pricingService->calculate(
            $items,
            $promo,
            $shippingRate,
            $request->boolean('gift_wrap'),
            $shippingAddress['country'],
        );

        $order = DB::transaction(function () use ($request, $user, $cart, $items, $promo, $shippingRate, $breakdown, $shippingAddress, $billingAddress) {
            $order = Order::create([
                'user_id' => $user->id,
                'reference' => $this->nextReference(),
                'status' => 'pending',
                ...$breakdown,
                'currency' => 'USD',
                'settlement_currency' => 'LKR',
                'promo_code_id' => $promo?->id,
                'shipping_rate_key' => $shippingRate->key,
                'gift_wrap' => $request->boolean('gift_wrap'),
                'gift_message' => $request->input('gift_message'),
                'customer_notes' => $request->input('customer_notes'),
                'shipping_address' => $shippingAddress,
                'billing_address' => $billingAddress,
                'email' => $user->email,
                'phone' => $user->phone ?? $shippingAddress['phone'] ?? null,
                'placed_at' => now(),
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'size_label' => $item->productSize->label,
                    'lot_number' => $item->product->lot_number,
                    'unit_price_cents' => $item->productSize->price_cents,
                    'quantity' => $item->quantity,
                    'line_total_cents' => $item->productSize->price_cents * $item->quantity,
                ]);
            }

            $cart->items()->delete();

            return $order;
        });

        return new OrderResource($order->load('items'));
    }

    /**
     * Reject an order if the line's product is inactive or there is not
     * enough stock to cover the requested quantity.
     */
    private function assertPurchasable(CartItem $item): void
    {
        if (! $item->product->is_active) {
            throw ValidationException::withMessages([
                'items' => ["{$item->product->name} is no longer available."],
            ]);
        }

        $available = $item->productSize->stock_quantity ?? $item->product->stock_quantity;

        if ($item->quantity > $available) {
            throw ValidationException::withMessages([
                'items' => ["Only {$available} of {$item->product->name} ({$item->productSize->label}) left in stock."],
            ]);
        }
    }

    /**
     * The next sequential order reference for the current year, e.g.
     * CS-2026-0001. Locks the year's rows for the duration of the
     * transaction to serialize concurrent order creation.
     */
    private function nextReference(): string
    {
        $year = now()->year;
        // A bare COUNT(*) ... FOR UPDATE is rejected by Postgres ("FOR UPDATE
        // is not allowed with aggregate functions"), so lock the id column
        // and count the results in PHP instead — portable across both.
        $count = Order::query()->whereYear('created_at', $year)->lockForUpdate()->pluck('id')->count();

        return sprintf('CS-%d-%04d', $year, $count + 1);
    }
}
