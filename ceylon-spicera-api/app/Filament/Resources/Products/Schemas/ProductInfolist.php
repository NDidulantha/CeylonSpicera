<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('category.name')
                    ->label('Category'),
                TextEntry::make('name'),
                TextEntry::make('slug'),
                TextEntry::make('sku')
                    ->label('SKU'),
                TextEntry::make('base_price_cents')
                    ->numeric(),
                TextEntry::make('short_description'),
                TextEntry::make('long_description')
                    ->columnSpanFull(),
                TextEntry::make('badge')
                    ->placeholder('-'),
                TextEntry::make('stock_status')
                    ->badge(),
                TextEntry::make('stock_quantity')
                    ->numeric(),
                TextEntry::make('estate')
                    ->placeholder('-'),
                TextEntry::make('harvest_month')
                    ->placeholder('-'),
                TextEntry::make('lot_number')
                    ->placeholder('-'),
                TextEntry::make('rating')
                    ->numeric(),
                TextEntry::make('review_count')
                    ->numeric(),
                IconEntry::make('is_featured')
                    ->boolean(),
                IconEntry::make('is_active')
                    ->boolean(),
                TextEntry::make('sort_order')
                    ->numeric(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
