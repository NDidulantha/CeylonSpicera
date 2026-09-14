<?php

use App\Models\NewsletterSubscriber;

test('subscribes a new email', function () {
    $response = $this->postJson('/api/newsletter/subscribe', [
        'email' => 'buyer@example.com',
        'name' => 'Buyer',
        'source' => 'footer',
    ]);

    $response->assertCreated();

    $this->assertDatabaseHas('newsletter_subscribers', [
        'email' => 'buyer@example.com',
        'name' => 'Buyer',
    ]);
});

test('resubscribes an existing unsubscribed email instead of duplicating it', function () {
    NewsletterSubscriber::factory()->create([
        'email' => 'buyer@example.com',
        'unsubscribed_at' => now(),
    ]);

    $response = $this->postJson('/api/newsletter/subscribe', [
        'email' => 'buyer@example.com',
    ]);

    $response->assertCreated();

    expect(NewsletterSubscriber::query()->where('email', 'buyer@example.com')->count())->toBe(1);
    expect(NewsletterSubscriber::query()->where('email', 'buyer@example.com')->first()->unsubscribed_at)->toBeNull();
});

test('rejects an invalid email', function () {
    $response = $this->postJson('/api/newsletter/subscribe', ['email' => 'not-an-email']);

    $response->assertUnprocessable();
});

test('silently accepts but does not store a honeypot submission', function () {
    $response = $this->postJson('/api/newsletter/subscribe', [
        'email' => 'bot@example.com',
        'website' => 'https://spam.example.com',
    ]);

    $response->assertOk();

    $this->assertDatabaseMissing('newsletter_subscribers', ['email' => 'bot@example.com']);
});

test('is rate limited', function () {
    for ($i = 0; $i < 3; $i++) {
        $this->postJson('/api/newsletter/subscribe', ['email' => "buyer{$i}@example.com"])->assertCreated();
    }

    $this->postJson('/api/newsletter/subscribe', ['email' => 'buyer4@example.com'])
        ->assertStatus(429);
});
