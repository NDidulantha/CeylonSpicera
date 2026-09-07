<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestOrders extends TableWidget
{
    protected static ?int $sort = 2;

    public function table(Table $table): Table
    {
        return $table
            ->heading('Latest orders')
            ->query(fn (): Builder => Order::query()->latest('placed_at')->limit(5))
            ->paginated(false)
            ->columns([
                TextColumn::make('reference')
                    ->weight('bold'),
                TextColumn::make('user.name')
                    ->label('Customer'),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('total_cents')
                    ->label('Total')
                    ->formatStateUsing(fn (int $state): string => '$'.number_format($state / 100, 2)),
                TextColumn::make('placed_at')
                    ->dateTime()
                    ->since(),
            ]);
    }
}
