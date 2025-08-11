<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InstructorLoginController extends Controller
{
    /**
     * Display the instructor login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/instructor-login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        // Clear any previous authentication to prevent conflicts
        \App\Services\AuthService::clearForNewRole();

        $request->authenticateWithRole('instructor');

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::INSTRUCTOR_HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        // Use AuthService to logout from all guards
        \App\Services\AuthService::logout();

        return redirect('/');
    }
}
