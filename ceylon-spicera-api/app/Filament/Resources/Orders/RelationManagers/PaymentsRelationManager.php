<?php

namespace App\Filament\Resources\Orders\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'payments';

    /**
     * Payment records come only from the PayHere webhook — never created,
     * edited, or deleted from the admin panel.
     */
    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('gateway_payment_id')
            ->columns([
                TextColumn::make('gateway'),
                TextColumn::make('gateway_payment_id')
                    ->label('Gateway payment ID'),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('amount')
                    ->numeric(),
                TextColumn::make('currency'),
                TextColumn::make('method'),
                TextColumn::make('card_last4')
                    ->label('Card last 4'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->label('Recorded at'),
            ])
            ->headerActions([])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
