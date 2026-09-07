<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuoteCartRequest extends FormRequest
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
            'shipping_key' => ['required', 'string', Rule::exists('shipping_rates', 'key')->where('is_active', true)],
            'country' => ['required', 'string', 'max:255'],
            'gift_wrap' => ['nullable', 'boolean'],
            'promo_code' => ['nullable', 'string', 'max:255'],
        ];
    }
}
