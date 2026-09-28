<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // The app container is never reached directly (docker-compose.prod.yml
        // only `expose`s it, not `ports:`) — Caddy's reverse proxy is the only
        // thing that can reach it, and Caddy already sets X-Forwarded-*
        // headers. Without trusting it, Laravel thinks every request is
        // plain HTTP (the app<->Caddy hop really is), so url()/pagination
        // links come out as http:// even though the real request was https.
        $middleware->trustProxies(at: '*');
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
