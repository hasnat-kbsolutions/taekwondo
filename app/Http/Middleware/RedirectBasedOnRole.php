<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $role = Auth::user()->role;

        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'organization' => redirect()->route('organization.dashboard'),
            'club' => redirect()->route('club.dashboard'),
            'student' => redirect()->route('student.dashboard'),
            'guardian' => redirect()->route('guardian.dashboard'),
            'instructor' => redirect()->route('instructor.dashboard'),
            default => abort(403, 'Unknown role.'),
        };
    }
}
