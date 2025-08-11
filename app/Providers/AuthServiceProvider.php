<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates for each user type
        Gate::define('admin-access', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('organization-access', function (User $user) {
            return in_array($user->role, ['admin', 'organization']);
        });

        Gate::define('club-access', function (User $user) {
            return in_array($user->role, ['admin', 'organization', 'club']);
        });

        Gate::define('instructor-access', function (User $user) {
            return in_array($user->role, ['admin', 'organization', 'club', 'instructor']);
        });

        Gate::define('student-access', function (User $user) {
            return in_array($user->role, ['admin', 'organization', 'club', 'instructor', 'student']);
        });

        Gate::define('guardian-access', function (User $user) {
            return in_array($user->role, ['admin', 'organization', 'club', 'guardian']);
        });

        // Register custom authentication guards
        $this->registerCustomGuards();
    }

    /**
     * Register custom authentication guards for different user types
     */
    protected function registerCustomGuards(): void
    {
        // Admin guard
        Auth::extend('admin', function ($app, $name, array $config) {
            $guard = new \Illuminate\Auth\SessionGuard(
                $name,
                Auth::createUserProvider($config['provider']),
                $app['session.store']
            );

            $guard->setUserProvider(Auth::createUserProvider($config['provider']));
            return $guard;
        });

        // Organization guard
        Auth::extend('organization', function ($app, $name, array $config) {
            $guard = new \Illuminate\Auth\SessionGuard(
                $name,
                Auth::createUserProvider($config['provider']),
                $app['session.store']
            );

            $guard->setUserProvider(Auth::createUserProvider($config['provider']));
            return $guard;
        });

        // Club guard
        Auth::extend('club', function ($app, $name, array $config) {
            $guard = new \Illuminate\Auth\SessionGuard(
                $name,
                Auth::createUserProvider($config['provider']),
                $app['session.store']
            );

            $guard->setUserProvider(Auth::createUserProvider($config['provider']));
            return $guard;
        });

        // Student guard
        Auth::extend('student', function ($app, $name, array $config) {
            $guard = new \Illuminate\Auth\SessionGuard(
                $name,
                Auth::createUserProvider($config['provider']),
                $app['session.store']
            );

            $guard->setUserProvider(Auth::createUserProvider($config['provider']));
            return $guard;
        });

        // Guardian guard
        Auth::extend('guardian', function ($app, $name, array $config) {
            $guard = new \Illuminate\Auth\SessionGuard(
                $name,
                Auth::createUserProvider($config['provider']),
                $app['session.store']
            );

            $guard->setUserProvider(Auth::createUserProvider($config['provider']));
            return $guard;
        });

        // Instructor guard
        Auth::extend('instructor', function ($app, $name, array $config) {
            $guard = new \Illuminate\Auth\SessionGuard(
                $name,
                Auth::createUserProvider($config['provider']),
                $app['session.store']
            );

            $guard->setUserProvider(Auth::createUserProvider($config['provider']));
            return $guard;
        });
    }
}
