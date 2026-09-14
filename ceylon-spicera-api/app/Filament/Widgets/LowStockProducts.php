<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LowStockProducts extends TableWidget
{
    protected static ?int $sort = 3;

    public function table(Table $table): Table
    {
        return $table
            ->heading('Low stock products')
            ->query(
                fn (): Builder => Product::query()
                    ->where('is_active', true)
                    ->whereIn('stock_status', ['low', 'out'])
                    ->orderBy('stock_quantity')
            )
            ->paginated(false)
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('category.name'),
                TextColumn::make('stock_status')
                    ->badge(),
                TextColumn::make('stock_quantity')
                    ->numeric()
                    ->color('danger'),
            ]);
    }
}
