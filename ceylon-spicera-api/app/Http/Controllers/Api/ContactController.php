<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\ContactRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * Record a contact message. Bots that fill the honeypot field are told
     * they succeeded but never get a row.
     */
    public function store(ContactRequest $request): JsonResponse
    {
        if (filled($request->input('website'))) {
            return response()->json(['message' => 'Message sent.'], 201);
        }

        ContactMessage::query()->create($request->only([
            'name', 'email', 'phone', 'company', 'inquiry_type', 'subject', 'message',
        ]));

        return response()->json(['message' => 'Message sent.'], 201);
    }
}
