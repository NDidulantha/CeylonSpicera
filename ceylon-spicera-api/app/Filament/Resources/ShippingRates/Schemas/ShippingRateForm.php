<?php

namespace App\Filament\Resources\ShippingRates\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ShippingRateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('key')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('eta')
                    ->required(),
                TextInput::make('price_cents')
                    ->required()
                    ->numeric(),
                TextInput::make('free_above_cents')
                    ->numeric(),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
