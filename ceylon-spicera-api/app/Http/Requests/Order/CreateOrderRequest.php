<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateOrderRequest extends FormRequest
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
            ...$this->addressRules('shipping_address'),
            ...$this->addressRules('billing_address'),
            'shipping_key' => ['required', 'string', Rule::exists('shipping_rates', 'key')->where('is_active', true)],
            'gift_wrap' => ['nullable', 'boolean'],
            'gift_message' => ['nullable', 'string', 'max:1000'],
            'customer_notes' => ['nullable', 'string', 'max:1000'],
            'promo_code' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function addressRules(string $prefix): array
    {
        return [
            $prefix => ['required', 'array'],
            "{$prefix}.first_name" => ['required', 'string', 'max:255'],
            "{$prefix}.last_name" => ['required', 'string', 'max:255'],
            "{$prefix}.company" => ['nullable', 'string', 'max:255'],
            "{$prefix}.country" => ['required', 'string', 'max:255'],
            "{$prefix}.street" => ['required', 'string', 'max:255'],
            "{$prefix}.apartment" => ['nullable', 'string', 'max:255'],
            "{$prefix}.city" => ['required', 'string', 'max:255'],
            "{$prefix}.state" => ['nullable', 'string', 'max:255'],
            "{$prefix}.postcode" => ['required', 'string', 'max:255'],
            "{$prefix}.phone" => ['nullable', 'string', 'max:255'],
        ];
    }
}
