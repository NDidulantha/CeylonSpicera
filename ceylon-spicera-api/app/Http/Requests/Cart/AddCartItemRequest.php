<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddCartItemRequest extends FormRequest
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
            'product_id' => ['required', 'integer', Rule::exists('products', 'id')->where('is_active', true)],
            'product_size_id' => [
                'required',
                'integer',
                Rule::exists('product_sizes', 'id')->where('product_id', $this->input('product_id')),
            ],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }
}
