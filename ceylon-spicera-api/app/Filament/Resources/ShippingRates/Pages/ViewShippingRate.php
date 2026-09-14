<?php

namespace App\Filament\Resources\ShippingRates\Pages;

use App\Filament\Resources\ShippingRates\ShippingRateResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewShippingRate extends ViewRecord
{
    protected static string $resource = ShippingRateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
