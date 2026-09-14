<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Newsletter\SubscribeRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;

class NewsletterController extends Controller
{
    /**
     * Subscribe an email to the newsletter. Bots that fill the honeypot
     * field are told they succeeded but never get a row.
     */
    public function subscribe(SubscribeRequest $request): JsonResponse
    {
        if (filled($request->input('website'))) {
            return response()->json(['message' => 'Subscribed.']);
        }

        NewsletterSubscriber::query()->updateOrCreate(
            ['email' => $request->string('email')->lower()->value()],
            [
                'name' => $request->input('name'),
                'source' => $request->input('source'),
                'unsubscribed_at' => null,
            ],
        );

        return response()->json(['message' => 'Subscribed.'], 201);
    }
}
