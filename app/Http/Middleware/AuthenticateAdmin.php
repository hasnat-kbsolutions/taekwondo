<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Services\AuthService;

class AuthenticateAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if there are multiple authenticated users in different guards
        $authenticatedGuards = [];
        $guards = ['web', 'admin', 'organization', 'club', 'student', 'guardian', 'instructor'];

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $authenticatedGuards[] = $guard;
            }
        }

        // If multiple guards are authenticated, clear all and redirect to login
        if (count($authenticatedGuards) > 1) {
            AuthService::clearForNewRole();
            return redirect()->route('login');
        }

        return $next($request);
    }
}
