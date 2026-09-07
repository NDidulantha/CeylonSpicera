<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                TextInput::make('sku')
                    ->label('SKU')
                    ->required(),
                TextInput::make('base_price_cents')
                    ->required()
                    ->numeric(),
                TextInput::make('short_description')
                    ->required(),
                Textarea::make('long_description')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('badge'),
                Select::make('stock_status')
                    ->options(['in' => 'In', 'low' => 'Low', 'out' => 'Out'])
                    ->default('in')
                    ->required(),
                TextInput::make('stock_quantity')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('estate'),
                TextInput::make('harvest_month'),
                TextInput::make('lot_number'),
                TextInput::make('rating')
                    ->helperText('Recomputed automatically when a review is approved.')
                    ->numeric()
                    ->default(0.0)
                    ->disabled(),
                TextInput::make('review_count')
                    ->helperText('Recomputed automatically when a review is approved.')
                    ->numeric()
                    ->default(0)
                    ->disabled(),
                Toggle::make('is_featured')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
