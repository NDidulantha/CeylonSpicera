<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Pricing constants
    |--------------------------------------------------------------------------
    |
    | Shipping prices and the free-shipping threshold live on the
    | shipping_rates table (seeded per rate). Gift wrap and duty are not
    | modelled by any table, so they live here instead of being hard-coded
    | in PricingService.
    |
    */

    'gift_wrap_cents' => (int) env('PRICING_GIFT_WRAP_CENTS', 600),

    'duty_rate' => (float) env('PRICING_DUTY_RATE', 0.045),

    'duty_exempt_country' => env('PRICING_DUTY_EXEMPT_COUNTRY', 'Sri Lanka'),

    /*
    |--------------------------------------------------------------------------
    | Settlement FX rate
    |--------------------------------------------------------------------------
    |
    | USD→LKR rate used only to convert an order's total at PayHere charge
    | time (orders.fx_rate). This is separate from the display-only
    | multi-currency estimates in the currencies table.
    |
    */

    'usd_to_lkr_rate' => (float) env('PRICING_USD_TO_LKR_RATE', 300),

];
