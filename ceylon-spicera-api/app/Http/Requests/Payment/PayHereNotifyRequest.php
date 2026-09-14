<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class PayHereNotifyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Public webhook — authenticity is established by the md5sig check in
     * the controller, not by a Laravel auth guard.
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
            'merchant_id' => ['required', 'string'],
            'order_id' => ['required', 'string'],
            'payment_id' => ['required', 'string'],
            'payhere_amount' => ['required', 'string'],
            'payhere_currency' => ['required', 'string'],
            'status_code' => ['required', 'string'],
            'md5sig' => ['required', 'string'],
            'method' => ['nullable', 'string'],
            'card_no' => ['nullable', 'string'],
        ];
    }
}
