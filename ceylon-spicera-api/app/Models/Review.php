<?php

namespace App\Models;

use Database\Factories\ReviewFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_id', 'user_id', 'rating', 'title', 'body', 'is_approved'])]
class Review extends Model
{
    /** @use HasFactory<ReviewFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_approved' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Approve the review and recompute the product's denormalised rating
     * and review count from all of its approved reviews.
     */
    public function approve(): void
    {
        $this->update(['is_approved' => true]);

        $approved = static::query()->where('product_id', $this->product_id)->where('is_approved', true);

        $this->product->update([
            'rating' => round((float) $approved->avg('rating'), 1),
            'review_count' => $approved->count(),
        ]);
    }
}
