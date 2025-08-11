<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleGuardMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Check if user is authenticated with the web guard first
        if (!Auth::guard('web')->check()) {
            return redirect()->route('login');
        }

        $user = Auth::guard('web')->user();

        // Check if user has the required role
        if ($user->role !== $role) {
            abort(403, 'Access denied. Required role: ' . $role . '. Current user role: ' . $user->role);
        }

        // Ensure the user is authenticated with their role guard
        if (!Auth::guard($role)->check()) {
            // If not authenticated with role guard, authenticate them
            Auth::guard($role)->login($user);
        }

        // Switch to the role-specific guard for this request
        Auth::shouldUse($role);

        return $next($request);
    }
}
