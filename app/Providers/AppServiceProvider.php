<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
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
        // Fix MySQL key length issue with utf8mb4
        Schema::defaultStringLength(191);

        // Register observers
        StudentFeePlan::observe(StudentFeePlanObserver::class);

        Inertia::share([
            'auth' => fn() => [
                'user' => Auth::user()?->only(['id', 'name', 'email', 'role']),
            ],
        ]);
    }
}
