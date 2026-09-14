<?php

namespace App\Http\Requests\Newsletter;

use Illuminate\Foundation\Http\FormRequest;

class SubscribeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:255'],
            // Honeypot: real visitors never fill this hidden field. Left
            // unrestricted so a bot filling it doesn't get a validation
            // error that reveals the trap; the controller checks it instead.
            'website' => ['nullable', 'string'],
        ];
    }
}
