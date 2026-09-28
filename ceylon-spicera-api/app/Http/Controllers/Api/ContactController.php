<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\ContactRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Record a contact message and notify the business inbox. Bots that
     * fill the honeypot field are told they succeeded but never get a row
     * or trigger an email.
     */
    public function store(ContactRequest $request): JsonResponse
    {
        if (filled($request->input('website'))) {
            return response()->json(['message' => 'Message sent.'], 201);
        }

        $contactMessage = ContactMessage::query()->create($request->only([
            'name', 'email', 'phone', 'company', 'inquiry_type', 'subject', 'message',
        ]));

        Mail::to(config('mail.from.address'))->queue(new ContactMessageReceived($contactMessage));

        return response()->json(['message' => 'Message sent.'], 201);
    }
}
