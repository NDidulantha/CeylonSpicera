<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CurrencyResource;
use App\Models\Currency;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CurrencyController extends Controller
{
    /**
     * Display-only FX estimates against the USD base. Never used to charge.
     */
    public function index(): AnonymousResourceCollection
    {
        return CurrencyResource::collection(
            Currency::query()->orderBy('code')->get()
        );
    }
}
