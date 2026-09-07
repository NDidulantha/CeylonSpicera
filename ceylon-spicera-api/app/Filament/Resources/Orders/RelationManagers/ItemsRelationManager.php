<?php

namespace App\Filament\Resources\Orders\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    /**
     * Order lines are an immutable snapshot of what was purchased — never
     * created, edited, or deleted from the admin panel.
     */
    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('product_name')
            ->columns([
                TextColumn::make('product_name')
                    ->label('Product'),
                TextColumn::make('size_label')
                    ->label('Size'),
                TextColumn::make('lot_number'),
                TextColumn::make('unit_price_cents')
                    ->label('Unit price (cents)')
                    ->numeric(),
                TextColumn::make('quantity')
                    ->numeric(),
                TextColumn::make('line_total_cents')
                    ->label('Line total (cents)')
                    ->numeric(),
            ])
            ->headerActions([])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
