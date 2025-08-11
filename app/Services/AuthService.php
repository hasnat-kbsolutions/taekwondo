<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthService
{
    /**
     * Authenticate user with role-specific guard
     */
    public static function authenticateWithRole(string $email, string $password, string $role): bool
    {
        $credentials = ['email' => $email, 'password' => $password];

        // First authenticate with web guard
        if (Auth::guard('web')->attempt($credentials)) {
            $user = Auth::guard('web')->user();

            // Check if user has the required role
            if ($user->role === $role) {
                // Switch to role-specific guard for future operations
                Auth::shouldUse($role);
                return true;
            }

            // Logout if role doesn't match
            Auth::guard('web')->logout();
        }

        return false;
    }

    /**
     * Get the current authenticated user with role guard
     */
    public static function getCurrentUser(): ?User
    {
        $user = Auth::guard('web')->user();

        if ($user) {
            // Switch to role-specific guard for future operations
            Auth::shouldUse($user->role);
        }

        return $user;
    }

    /**
     * Check if user is authenticated with specific role
     */
    public static function hasRole(string $role): bool
    {
        $user = Auth::guard('web')->user();
        return $user && $user->role === $role;
    }

    /**
     * Check if user has any of the specified roles
     */
    public static function hasAnyRole(array $roles): bool
    {
        $user = Auth::guard('web')->user();
        return $user && in_array($user->role, $roles);
    }

    /**
     * Logout user from all guards
     */
    public static function logout(): void
    {
        $guards = ['web', 'admin', 'organization', 'club', 'student', 'guardian', 'instructor'];

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                Auth::guard($guard)->logout();
            }
        }

        // Clear session completely
        session()->invalidate();
        session()->regenerateToken();

        // Reset the default guard to web
        Auth::shouldUse('web');
    }

    /**
     * Clear authentication for a specific role and prepare for new login
     */
    public static function clearForNewRole(): void
    {
        $guards = ['web', 'admin', 'organization', 'club', 'student', 'guardian', 'instructor'];

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                Auth::guard($guard)->logout();
            }
        }

        // Clear session completely
        session()->invalidate();
        session()->regenerateToken();

        // Reset the default guard to web
        Auth::shouldUse('web');
    }

    /**
     * Get the appropriate redirect route based on user role
     */
    public static function getRedirectRoute(): string
    {
        $user = Auth::guard('web')->user();

        if (!$user) {
            return 'login';
        }

        return match ($user->role) {
            'admin' => 'admin.dashboard',
            'organization' => 'organization.dashboard',
            'club' => 'club.dashboard',
            'student' => 'student.dashboard',
            'guardian' => 'guardian.dashboard',
            'instructor' => 'instructor.dashboard',
            default => 'login',
        };
    }

    /**
     * Validate user access to a specific route/action
     */
    public static function canAccess(string $action, array $allowedRoles): bool
    {
        $user = Auth::guard('web')->user();

        if (!$user) {
            return false;
        }

        return in_array($user->role, $allowedRoles);
    }
}
