<?php

function contactMessagePayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Jane Buyer',
        'email' => 'jane@example.com',
        'phone' => '+44 7700 900000',
        'company' => 'Buyer Co',
        'inquiry_type' => 'Wholesale & Bulk Order',
        'subject' => 'Bulk cinnamon quote',
        'message' => 'We would like a quote for 500kg of cinnamon quills.',
    ], $overrides);
}

test('stores a contact message', function () {
    $response = $this->postJson('/api/contact', contactMessagePayload());

    $response->assertCreated();

    $this->assertDatabaseHas('contact_messages', [
        'email' => 'jane@example.com',
        'inquiry_type' => 'Wholesale & Bulk Order',
    ]);
});

test('rejects an invalid inquiry type', function () {
    $response = $this->postJson('/api/contact', contactMessagePayload(['inquiry_type' => 'Not A Real Type']));

    $response->assertUnprocessable();
});

test('requires a message', function () {
    $response = $this->postJson('/api/contact', contactMessagePayload(['message' => '']));

    $response->assertUnprocessable();
});

test('silently accepts but does not store a honeypot submission', function () {
    $response = $this->postJson('/api/contact', contactMessagePayload([
        'email' => 'bot@example.com',
        'website' => 'https://spam.example.com',
    ]));

    $response->assertCreated();

    $this->assertDatabaseMissing('contact_messages', ['email' => 'bot@example.com']);
});

test('is rate limited', function () {
    for ($i = 0; $i < 3; $i++) {
        $this->postJson('/api/contact', contactMessagePayload(['email' => "jane{$i}@example.com"]))->assertCreated();
    }

    $this->postJson('/api/contact', contactMessagePayload(['email' => 'jane4@example.com']))
        ->assertStatus(429);
});
