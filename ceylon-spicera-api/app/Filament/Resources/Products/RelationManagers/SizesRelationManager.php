<?php

namespace App\Filament\Resources\Products\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SizesRelationManager extends RelationManager
{
    protected static string $relationship = 'sizes';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('size_key')
                    ->required(),
                TextInput::make('label')
                    ->required(),
                TextInput::make('multiplier')
                    ->required()
                    ->numeric()
                    ->step(0.01),
                TextInput::make('price_cents')
                    ->label('Price (cents)')
                    ->required()
                    ->numeric(),
                TextInput::make('stock_quantity')
                    ->numeric(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('size_key')
            ->columns([
                TextColumn::make('size_key'),
                TextColumn::make('label'),
                TextColumn::make('multiplier')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('price_cents')
                    ->label('Price (cents)')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('stock_quantity')
                    ->numeric()
                    ->sortable(),
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
