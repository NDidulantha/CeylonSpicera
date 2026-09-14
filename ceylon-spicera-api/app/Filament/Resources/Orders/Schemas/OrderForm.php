<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Status')
                    ->description('The only fields an admin may change on a placed order.')
                    ->schema([
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'paid' => 'Paid',
                                'processing' => 'Processing',
                                'shipped' => 'Shipped',
                                'delivered' => 'Delivered',
                                'cancelled' => 'Cancelled',
                                'refunded' => 'Refunded',
                            ])
                            ->required(),
                        DateTimePicker::make('shipped_at'),
                        Textarea::make('customer_notes')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Order details')
                    ->description('Snapshotted at checkout — read only.')
                    ->schema([
                        TextInput::make('reference')
                            ->disabled(),
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->disabled(),
                        TextInput::make('email')
                            ->disabled(),
                        TextInput::make('phone')
                            ->disabled(),
                        TextInput::make('shipping_rate_key')
                            ->label('Shipping rate')
                            ->disabled(),
                        DateTimePicker::make('placed_at')
                            ->disabled(),
                        DateTimePicker::make('paid_at')
                            ->disabled(),
                    ])
                    ->columns(2),

                Section::make('Money')
                    ->description('Recomputed server-side at checkout — read only, never edited here.')
                    ->schema([
                        TextInput::make('subtotal_cents')->numeric()->disabled(),
                        TextInput::make('discount_cents')->numeric()->disabled(),
                        TextInput::make('shipping_cents')->numeric()->disabled(),
                        TextInput::make('gift_wrap_cents')->numeric()->disabled(),
                        TextInput::make('duty_cents')->numeric()->disabled(),
                        TextInput::make('total_cents')->numeric()->disabled(),
                        TextInput::make('currency')->disabled(),
                        TextInput::make('settlement_currency')->disabled(),
                        TextInput::make('settlement_amount')->numeric()->disabled(),
                        TextInput::make('fx_rate')->numeric()->disabled(),
                    ])
                    ->columns(2),

                Section::make('Gift')
                    ->schema([
                        TextInput::make('gift_wrap')
                            ->formatStateUsing(fn ($state) => $state ? 'Yes' : 'No')
                            ->disabled(),
                        Textarea::make('gift_message')
                            ->disabled()
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Addresses')
                    ->schema([
                        KeyValue::make('shipping_address')
                            ->disabled(),
                        KeyValue::make('billing_address')
                            ->disabled(),
                    ])
                    ->columns(2),
            ]);
    }
}
