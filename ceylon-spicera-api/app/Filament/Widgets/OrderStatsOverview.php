<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class OrderStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $paidThisMonth = Order::query()
            ->where('status', 'paid')
            ->whereMonth('paid_at', now()->month)
            ->whereYear('paid_at', now()->year);

        $revenueCents = (clone $paidThisMonth)->sum('total_cents');
        $ordersThisMonth = Order::query()->whereMonth('placed_at', now()->month)->whereYear('placed_at', now()->year)->count();
        $pendingOrders = Order::query()->where('status', 'pending')->count();
        $processingOrders = Order::query()->whereIn('status', ['paid', 'processing'])->count();

        return [
            Stat::make('Revenue this month', '$'.number_format($revenueCents / 100, 2)),
            Stat::make('Orders this month', $ordersThisMonth),
            Stat::make('Pending orders', $pendingOrders)
                ->color($pendingOrders > 0 ? 'warning' : 'success'),
            Stat::make('Awaiting fulfilment', $processingOrders)
                ->description('Paid or processing'),
        ];
    }
}
