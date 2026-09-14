<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Send every test request with a Referer matching the front end's
     * stateful domain, so Sanctum treats them as SPA session requests
     * the same way it would for the real Next.js app.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->withHeader('Referer', config('app.frontend_url'));
    }
}
