<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ContactMessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->disabled(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required()
                    ->disabled(),
                TextInput::make('phone')
                    ->tel()
                    ->disabled(),
                TextInput::make('company')
                    ->disabled(),
                Select::make('inquiry_type')
                    ->options([
                        'General Inquiry' => 'General inquiry',
                        'Wholesale & Bulk Order' => 'Wholesale & bulk order',
                        'Private Label' => 'Private label',
                        'Returns & Refunds' => 'Returns & refunds',
                        'Press & Partnerships' => 'Press & partnerships',
                        'Other' => 'Other',
                    ])
                    ->required()
                    ->disabled(),
                TextInput::make('subject')
                    ->disabled(),
                Textarea::make('message')
                    ->required()
                    ->disabled()
                    ->columnSpanFull(),
                Toggle::make('is_read')
                    ->required(),
                DateTimePicker::make('replied_at'),
            ]);
    }
}
