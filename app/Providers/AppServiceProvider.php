<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\StudentFeePlan;
use App\Observers\StudentFeePlanObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register observers
        StudentFeePlan::observe(StudentFeePlanObserver::class);

        Inertia::share([
            'auth' => fn() => [
                'user' => Auth::user()?->only(['id', 'name', 'email', 'role']),
            ],
        ]);
    }
}
