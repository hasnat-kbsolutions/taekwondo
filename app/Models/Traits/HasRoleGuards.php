<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\Auth;

trait HasRoleGuards
{
    /**
     * Get the guard name for the current user's role
     */
    public function getGuardName(): string
    {
        return $this->role;
    }

    /**
     * Switch to the appropriate guard based on user role
     */
    public function switchToRoleGuard(): void
    {
        $guard = $this->getGuardName();
        if (Auth::guard($guard)->check()) {
            Auth::shouldUse($guard);
        }
    }

    /**
     * Check if user is authenticated with their role guard
     */
    public function isAuthenticatedWithRoleGuard(): bool
    {
        return Auth::guard($this->getGuardName())->check();
    }

    /**
     * Get the authenticated user from their role guard
     */
    public static function fromRoleGuard(string $role)
    {
        return Auth::guard($role)->user();
    }

    /**
     * Check if user has admin role
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user has organization role
     */
    public function isOrganization(): bool
    {
        return $this->role === 'organization';
    }

    /**
     * Check if user has club role
     */
    public function isClub(): bool
    {
        return $this->role === 'club';
    }

    /**
     * Check if user has student role
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Check if user has guardian role
     */
    public function isGuardian(): bool
    {
        return $this->role === 'guardian';
    }

    /**
     * Check if user has instructor role
     */
    public function isInstructor(): bool
    {
        return $this->role === 'instructor';
    }

    /**
     * Check if user has any of the specified roles
     */
    public function hasAnyOfRoles(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Check if user has all of the specified roles
     */
    public function hasAllOfRoles(array $roles): bool
    {
        return count(array_intersect([$this->role], $roles)) === count($roles);
    }

    /**
     * Get the dashboard route for the user's role
     */
    public function getDashboardRoute(): string
    {
        return match ($this->role) {
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
     * Get the redirect route after login for the user's role
     */
    public function getLoginRedirectRoute(): string
    {
        return $this->getDashboardRoute();
    }
}
