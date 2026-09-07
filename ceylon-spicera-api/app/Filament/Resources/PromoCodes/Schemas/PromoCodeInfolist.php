<?php

namespace App\Filament\Resources\PromoCodes\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PromoCodeInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('code'),
                TextEntry::make('type')
                    ->badge(),
                TextEntry::make('value')
                    ->numeric(),
                TextEntry::make('min_subtotal_cents')
                    ->numeric(),
                TextEntry::make('usage_limit')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('used_count')
                    ->numeric(),
                TextEntry::make('per_user_limit')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('starts_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('expires_at')
                    ->dateTime()
                    ->placeholder('-'),
                IconEntry::make('is_active')
                    ->boolean(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
