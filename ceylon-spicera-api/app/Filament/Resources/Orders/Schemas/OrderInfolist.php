<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        $money = fn (string $name, string $label) => TextEntry::make($name)
            ->label($label)
            ->formatStateUsing(fn (int $state): string => '$'.number_format($state / 100, 2));

        return $schema
            ->components([
                Section::make('Order')
                    ->schema([
                        TextEntry::make('reference'),
                        TextEntry::make('user.name')
                            ->label('Customer'),
                        TextEntry::make('status')
                            ->badge(),
                        TextEntry::make('email')
                            ->label('Email address'),
                        TextEntry::make('phone')
                            ->placeholder('-'),
                        TextEntry::make('shipping_rate_key')
                            ->label('Shipping rate'),
                        TextEntry::make('placed_at')->dateTime()->placeholder('-'),
                        TextEntry::make('paid_at')->dateTime()->placeholder('-'),
                        TextEntry::make('shipped_at')->dateTime()->placeholder('-'),
                    ])
                    ->columns(3),

                Section::make('Money')
                    ->schema([
                        $money('subtotal_cents', 'Subtotal'),
                        $money('discount_cents', 'Discount'),
                        $money('shipping_cents', 'Shipping'),
                        $money('gift_wrap_cents', 'Gift wrap'),
                        $money('duty_cents', 'Duty'),
                        $money('total_cents', 'Total'),
                        TextEntry::make('promoCode.code')
                            ->label('Promo code')
                            ->placeholder('-'),
                        TextEntry::make('settlement_amount')
                            ->label('Settlement (LKR cents)')
                            ->numeric()
                            ->placeholder('-'),
                        TextEntry::make('fx_rate')
                            ->label('FX rate (USD→LKR)')
                            ->numeric()
                            ->placeholder('-'),
                    ])
                    ->columns(3),

                Section::make('Gift')
                    ->schema([
                        IconEntry::make('gift_wrap')->boolean(),
                        TextEntry::make('gift_message')->placeholder('-')->columnSpanFull(),
                        TextEntry::make('customer_notes')->placeholder('-')->columnSpanFull(),
                    ]),

                Section::make('Addresses')
                    ->schema([
                        KeyValueEntry::make('shipping_address'),
                        KeyValueEntry::make('billing_address'),
                    ])
                    ->columns(2),
            ]);
    }
}
