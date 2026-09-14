<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContactRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'inquiry_type' => ['required', Rule::in([
                'General Inquiry',
                'Wholesale & Bulk Order',
                'Private Label',
                'Returns & Refunds',
                'Press & Partnerships',
                'Other',
            ])],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            // Honeypot: real visitors never fill this hidden field. Left
            // unrestricted so a bot filling it doesn't get a validation
            // error that reveals the trap; the controller checks it instead.
            'website' => ['nullable', 'string'],
        ];
    }
}
