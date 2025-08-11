<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\OrganizationLoginController;
use App\Http\Controllers\Auth\ClubLoginController;
use App\Http\Controllers\Auth\InstructorLoginController;
use App\Http\Controllers\Auth\StudentLoginController;
// use App\Http\Controllers\Auth\GuardianLoginController;
use Illuminate\Support\Facades\Route;

// Routes accessible to both guests and authenticated users
Route::middleware(['allow.login.when.authenticated'])->group(function () {
    // Role selection page (main login)
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    // Role-specific login routes
    Route::get('admin/login', [AdminLoginController::class, 'create'])
        ->name('admin.login');
    Route::post('admin/login', [AdminLoginController::class, 'store']);

    Route::get('organization/login', [OrganizationLoginController::class, 'create'])
        ->name('organization.login');
    Route::post('organization/login', [OrganizationLoginController::class, 'store']);

    Route::get('club/login', [ClubLoginController::class, 'create'])
        ->name('club.login');
    Route::post('club/login', [ClubLoginController::class, 'store']);

    Route::get('instructor/login', [InstructorLoginController::class, 'create'])
        ->name('instructor.login');
    Route::post('instructor/login', [InstructorLoginController::class, 'store']);

    Route::get('student/login', [StudentLoginController::class, 'create'])
        ->name('student.login');
    Route::post('student/login', [StudentLoginController::class, 'store']);

    // Route::get('guardian/login', [GuardianLoginController::class, 'create'])
    //     ->name('guardian.login');
    // Route::post('guardian/login', [GuardianLoginController::class, 'store']);

    // Legacy login route (redirects to role selection)
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('guest')->group(function () {
    // Register routes
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    // Role-specific logout routes
    Route::post('admin/logout', [AdminLoginController::class, 'destroy'])
        ->name('admin.logout');
    Route::post('organization/logout', [OrganizationLoginController::class, 'destroy'])
        ->name('organization.logout');
    Route::post('club/logout', [ClubLoginController::class, 'destroy'])
        ->name('club.logout');
    Route::post('instructor/logout', [InstructorLoginController::class, 'destroy'])
        ->name('instructor.logout');
    Route::post('student/logout', [StudentLoginController::class, 'destroy'])
        ->name('student.logout');
    // Route::post('guardian/logout', [GuardianLoginController::class, 'destroy'])
    //     ->name('guardian.logout');

    // Legacy logout route
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
