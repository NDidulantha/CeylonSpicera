<?php

namespace App\Filament\Resources\PromoCodes\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PromoCodeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->dehydrateStateUsing(fn (?string $state) => strtoupper((string) $state))
                    ->formatStateUsing(fn (?string $state) => strtoupper((string) $state)),
                Select::make('type')
                    ->options(['percent' => 'Percent', 'fixed' => 'Fixed'])
                    ->required(),
                TextInput::make('value')
                    ->required()
                    ->numeric(),
                TextInput::make('min_subtotal_cents')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('usage_limit')
                    ->numeric(),
                TextInput::make('used_count')
                    ->helperText('Incremented only by a successful PayHere payment.')
                    ->numeric()
                    ->default(0)
                    ->disabled(),
                TextInput::make('per_user_limit')
                    ->numeric(),
                DateTimePicker::make('starts_at'),
                DateTimePicker::make('expires_at'),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
