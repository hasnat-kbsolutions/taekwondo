<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Exports\StudentsExport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
})->middleware('redirect.role');

// Shared invoice routes for all user types
Route::middleware('auth')->group(function () {
    Route::get('/invoice/{payment}', [App\Http\Controllers\InvoiceController::class, 'show'])->name('invoice.show');
    Route::get('/invoice/{payment}/download', [App\Http\Controllers\InvoiceController::class, 'download'])->name('invoice.download');
});


Route::get('/storage-link', function () {
    Artisan::call('storage:link');
    return 'storage-linked';
});

// General logout route for all user types
Route::post('/logout', function () {
    \App\Services\AuthService::logout();
    return redirect('/login');
})->name('logout');

Route::get('/logout', function () {
    \App\Services\AuthService::logout();
    return redirect('/login');
})->name('logout.get');

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Certificate CRUD routes
    Route::get('/certifications', [\App\Http\Controllers\Admin\CertificationController::class, 'index'])->name('certifications.index');
    Route::get('/certifications/create', [\App\Http\Controllers\Admin\CertificationController::class, 'create'])->name('certifications.create');
    Route::post('/certifications', [\App\Http\Controllers\Admin\CertificationController::class, 'store'])->name('certifications.store');
    Route::get('/certifications/{certification}/edit', [\App\Http\Controllers\Admin\CertificationController::class, 'edit'])->name('certifications.edit');
    Route::put('/certifications/{certification}', [\App\Http\Controllers\Admin\CertificationController::class, 'update'])->name('certifications.update');
    Route::delete('/certifications/{certification}', [App\Http\Controllers\Admin\CertificationController::class, 'destroy'])->name('certifications.destroy');

    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/students/export', [App\Http\Controllers\Admin\StudentController::class, 'export'])->name('students.export');

    Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
    Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/locations', [App\Http\Controllers\Admin\LocationController::class, 'index'])->name('locations.index');
    Route::get('/locations/create', [App\Http\Controllers\Admin\LocationController::class, 'create'])->name('locations.create');
    Route::post('/locations', [App\Http\Controllers\Admin\LocationController::class, 'store'])->name('locations.store');
    Route::get('/locations/{location}/edit', [App\Http\Controllers\Admin\LocationController::class, 'edit'])->name('locations.edit');
    Route::put('/locations/{location}', [App\Http\Controllers\Admin\LocationController::class, 'update'])->name('locations.update');
    Route::delete('/locations/{location}', [App\Http\Controllers\Admin\LocationController::class, 'destroy'])->name('locations.destroy');

    Route::get('/students', [App\Http\Controllers\Admin\StudentController::class, 'index'])->name('students.index');
    Route::get('/students/create', [App\Http\Controllers\Admin\StudentController::class, 'create'])->name('students.create');
    Route::post('/students', [App\Http\Controllers\Admin\StudentController::class, 'store'])->name('students.store');
    Route::get('/students/{student}/edit', [App\Http\Controllers\Admin\StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{student}', [App\Http\Controllers\Admin\StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [App\Http\Controllers\Admin\StudentController::class, 'destroy'])->name('students.destroy');

    // REMOVED: Student Insights - Financial analytics restricted

    // Club Routes
    Route::get('/clubs', [App\Http\Controllers\Admin\ClubController::class, 'index'])->name('clubs.index');
    Route::get('/clubs/create', [App\Http\Controllers\Admin\ClubController::class, 'create'])->name('clubs.create');
    Route::post('/clubs', [App\Http\Controllers\Admin\ClubController::class, 'store'])->name('clubs.store');
    Route::get('/clubs/{club}/edit', [App\Http\Controllers\Admin\ClubController::class, 'edit'])->name('clubs.edit');
    Route::put('/clubs/{club}', [App\Http\Controllers\Admin\ClubController::class, 'update'])->name('clubs.update');
    Route::delete('/clubs/{club}', [App\Http\Controllers\Admin\ClubController::class, 'destroy'])->name('clubs.destroy');

    // Organization Routes
    Route::get('/organizations', [App\Http\Controllers\Admin\OrganizationController::class, 'index'])->name('organizations.index');
    Route::get('/organizations/create', [App\Http\Controllers\Admin\OrganizationController::class, 'create'])->name('organizations.create');
    Route::post('/organizations', [App\Http\Controllers\Admin\OrganizationController::class, 'store'])->name('organizations.store');
    Route::get('/organizations/{organization}/edit', [App\Http\Controllers\Admin\OrganizationController::class, 'edit'])->name('organizations.edit');
    Route::put('/organizations/{organization}', [App\Http\Controllers\Admin\OrganizationController::class, 'update'])->name('organizations.update');
    Route::delete('/organizations/{organization}', [App\Http\Controllers\Admin\OrganizationController::class, 'destroy'])->name('organizations.destroy');

    // Supporter Routes
    Route::get('/supporters', [App\Http\Controllers\Admin\SupporterController::class, 'index'])->name('supporters.index');
    Route::get('/supporters/create', [App\Http\Controllers\Admin\SupporterController::class, 'create'])->name('supporters.create');
    Route::post('/supporters', [App\Http\Controllers\Admin\SupporterController::class, 'store'])->name('supporters.store');
    Route::get('/supporters/{supporter}/edit', [App\Http\Controllers\Admin\SupporterController::class, 'edit'])->name('supporters.edit');
    Route::put('/supporters/{supporter}', [App\Http\Controllers\Admin\SupporterController::class, 'update'])->name('supporters.update');
    Route::delete('/supporters/{supporter}', [App\Http\Controllers\Admin\SupporterController::class, 'destroy'])->name('supporters.destroy');

    Route::get('/attendances', [App\Http\Controllers\Admin\AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/attendances/create', [App\Http\Controllers\Admin\AttendanceController::class, 'create'])->name('attendances.create');
    Route::post('/attendances', [App\Http\Controllers\Admin\AttendanceController::class, 'store'])->name('attendances.store');
    Route::get('/attendances/{attendance}/edit', [App\Http\Controllers\Admin\AttendanceController::class, 'edit'])->name('attendances.edit');
    Route::put('/attendances/{attendance}', [App\Http\Controllers\Admin\AttendanceController::class, 'update'])->name('attendances.update');
    Route::delete('/attendances/{attendance}', [App\Http\Controllers\Admin\AttendanceController::class, 'destroy'])->name('attendances.destroy');
    Route::post('/attendances/toggle', [App\Http\Controllers\Admin\AttendanceController::class, 'toggle'])->name('attendances.toggle');

    Route::get('/roles', [App\Http\Controllers\Admin\RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [App\Http\Controllers\Admin\RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [App\Http\Controllers\Admin\RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}/edit', [App\Http\Controllers\Admin\RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [App\Http\Controllers\Admin\RoleController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{role}', [App\Http\Controllers\Admin\RoleController::class, 'destroy'])->name('roles.destroy');

    Route::get('/instructors', [App\Http\Controllers\Admin\InstructorController::class, 'index'])->name('instructors.index');
    Route::get('/instructors/create', [App\Http\Controllers\Admin\InstructorController::class, 'create'])->name('instructors.create');
    Route::post('/instructors', [App\Http\Controllers\Admin\InstructorController::class, 'store'])->name('instructors.store');
    Route::get('/instructors/{instructor}/edit', [App\Http\Controllers\Admin\InstructorController::class, 'edit'])->name('instructors.edit');
    Route::put('/instructors/{instructor}', [App\Http\Controllers\Admin\InstructorController::class, 'update'])->name('instructors.update');
    Route::delete('/instructors/{instructor}', [App\Http\Controllers\Admin\InstructorController::class, 'destroy'])->name('instructors.destroy');

    // REMOVED: Admin Plans and Fee Plans - Pricing restricted to Clubs only

    // REMOVED: Admin Payment routes - Financial management restricted to Clubs

    // Student Password Update
    Route::patch('/students/{student}/password', [App\Http\Controllers\Admin\StudentController::class, 'updatePassword'])->name('students.updatePassword');

    // Organization Password Update
    Route::patch('/organizations/{organization}/password', [App\Http\Controllers\Admin\OrganizationController::class, 'updatePassword'])->name('organizations.updatePassword');

    // Club Password Update
    Route::patch('/clubs/{club}/password', [App\Http\Controllers\Admin\ClubController::class, 'updatePassword'])->name('clubs.updatePassword');

    // Admin Currency Management
    Route::get('/currencies', [App\Http\Controllers\Admin\CurrencyController::class, 'index'])->name('currencies.index');
    Route::get('/currencies/create', [App\Http\Controllers\Admin\CurrencyController::class, 'create'])->name('currencies.create');
    Route::post('/currencies', [App\Http\Controllers\Admin\CurrencyController::class, 'store'])->name('currencies.store');
    Route::get('/currencies/{currency}/edit', [App\Http\Controllers\Admin\CurrencyController::class, 'edit'])->name('currencies.edit');
    Route::put('/currencies/{currency}', [App\Http\Controllers\Admin\CurrencyController::class, 'update'])->name('currencies.update');
    Route::delete('/currencies/{currency}', [App\Http\Controllers\Admin\CurrencyController::class, 'destroy'])->name('currencies.destroy');
    Route::patch('/currencies/{currency}/toggle-active', [App\Http\Controllers\Admin\CurrencyController::class, 'toggleActive'])->name('currencies.toggle-active');
    Route::patch('/currencies/{currency}/set-default', [App\Http\Controllers\Admin\CurrencyController::class, 'setDefault'])->name('currencies.set-default');

    // Admin Ratings
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'adminIndex'])->name('ratings.index');

    // REMOVED: Admin Reports - Financial reporting restricted

    // Bank Information Routes
    Route::get('/bank-information', [App\Http\Controllers\Admin\BankInformationController::class, 'index'])->name('bank-information.index');
    Route::get('/bank-information/create', [App\Http\Controllers\Admin\BankInformationController::class, 'create'])->name('bank-information.create');
    Route::post('/bank-information', [App\Http\Controllers\Admin\BankInformationController::class, 'store'])->name('bank-information.store');
    Route::get('/bank-information/{bankInformation}/edit', [App\Http\Controllers\Admin\BankInformationController::class, 'edit'])->name('bank-information.edit');
    Route::put('/bank-information/{bankInformation}', [App\Http\Controllers\Admin\BankInformationController::class, 'update'])->name('bank-information.update');
    Route::delete('/bank-information/{bankInformation}', [App\Http\Controllers\Admin\BankInformationController::class, 'destroy'])->name('bank-information.destroy');
});

// Organization routes
Route::middleware(['auth', 'role:organization'])->prefix('organization')->name('organization.')->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Organization\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/students', [App\Http\Controllers\Organization\StudentController::class, 'index'])->name('students.index');
    Route::get('/students/create', [App\Http\Controllers\Organization\StudentController::class, 'create'])->name('students.create');
    Route::post('/students', [App\Http\Controllers\Organization\StudentController::class, 'store'])->name('students.store');
    Route::get('/students/{student}/edit', [App\Http\Controllers\Organization\StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{student}', [App\Http\Controllers\Organization\StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [App\Http\Controllers\Organization\StudentController::class, 'destroy'])->name('students.destroy');
    Route::patch('/students/{student}/password', [App\Http\Controllers\Organization\StudentController::class, 'updatePassword'])->name('students.updatePassword');

    Route::get('/instructors', [App\Http\Controllers\Organization\InstructorController::class, 'index'])->name('instructors.index');
    Route::get('/instructors/create', [App\Http\Controllers\Organization\InstructorController::class, 'create'])->name('instructors.create');
    Route::post('/instructors', [App\Http\Controllers\Organization\InstructorController::class, 'store'])->name('instructors.store');
    Route::get('/instructors/{instructor}/edit', [App\Http\Controllers\Organization\InstructorController::class, 'edit'])->name('instructors.edit');
    Route::put('/instructors/{instructor}', [App\Http\Controllers\Organization\InstructorController::class, 'update'])->name('instructors.update');
    Route::delete('/instructors/{instructor}', [App\Http\Controllers\Organization\InstructorController::class, 'destroy'])->name('instructors.destroy');

    Route::get('/clubs', [App\Http\Controllers\Organization\ClubController::class, 'index'])->name('clubs.index');
    Route::get('/clubs/create', [App\Http\Controllers\Organization\ClubController::class, 'create'])->name('clubs.create');
    Route::post('/clubs', [App\Http\Controllers\Organization\ClubController::class, 'store'])->name('clubs.store');
    Route::get('/clubs/{club}/edit', [App\Http\Controllers\Organization\ClubController::class, 'edit'])->name('clubs.edit');
    Route::put('/clubs/{club}', [App\Http\Controllers\Organization\ClubController::class, 'update'])->name('clubs.update');
    Route::delete('/clubs/{club}', [App\Http\Controllers\Organization\ClubController::class, 'destroy'])->name('clubs.destroy');
    Route::patch('/clubs/{club}/password', [App\Http\Controllers\Organization\ClubController::class, 'updatePassword'])->name('clubs.updatePassword');

    // REMOVED: Payment routes - Organizations cannot see or manage student payments/earnings

    // Organization Student Fee Plans Routes - Organizations can manage their students' fee plans
    Route::get('/student-fee-plans', [App\Http\Controllers\Organization\StudentFeePlanController::class, 'index'])->name('student-fee-plans.index');
    Route::get('/student-fee-plans/create', [App\Http\Controllers\Organization\StudentFeePlanController::class, 'create'])->name('student-fee-plans.create');
    Route::post('/student-fee-plans', [App\Http\Controllers\Organization\StudentFeePlanController::class, 'store'])->name('student-fee-plans.store');
    Route::get('/student-fee-plans/{studentFeePlan}/edit', [App\Http\Controllers\Organization\StudentFeePlanController::class, 'edit'])->name('student-fee-plans.edit');
    Route::put('/student-fee-plans/{studentFeePlan}', [App\Http\Controllers\Organization\StudentFeePlanController::class, 'update'])->name('student-fee-plans.update');
    Route::delete('/student-fee-plans/{studentFeePlan}', [App\Http\Controllers\Organization\StudentFeePlanController::class, 'destroy'])->name('student-fee-plans.destroy');

    Route::get('/attendances', [App\Http\Controllers\Organization\AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/attendances/create', [App\Http\Controllers\Organization\AttendanceController::class, 'create'])->name('attendances.create');
    Route::post('/attendances', [App\Http\Controllers\Organization\AttendanceController::class, 'store'])->name('attendances.store');
    Route::get('/attendances/{attendance}/edit', [App\Http\Controllers\Organization\AttendanceController::class, 'edit'])->name('attendances.edit');
    Route::put('/attendances/{attendance}', [App\Http\Controllers\Organization\AttendanceController::class, 'update'])->name('attendances.update');
    Route::delete('/attendances/{attendance}', [App\Http\Controllers\Organization\AttendanceController::class, 'destroy'])->name('attendances.destroy');
    Route::post('/attendances/toggle', [App\Http\Controllers\Organization\AttendanceController::class, 'toggle'])->name('attendances.toggle');

    Route::get('/certifications', [\App\Http\Controllers\Organization\CertificationController::class, 'index'])->name('certifications.index');
    Route::get('/certifications/create', [\App\Http\Controllers\Organization\CertificationController::class, 'create'])->name('certifications.create');
    Route::post('/certifications', [\App\Http\Controllers\Organization\CertificationController::class, 'store'])->name('certifications.store');
    Route::get('/certifications/{certification}/edit', [\App\Http\Controllers\Organization\CertificationController::class, 'edit'])->name('certifications.edit');
    Route::put('/certifications/{certification}', [\App\Http\Controllers\Organization\CertificationController::class, 'update'])->name('certifications.update');
    Route::delete('/certifications/{certification}', [App\Http\Controllers\Organization\CertificationController::class, 'destroy'])->name('certifications.destroy');

    // Organization Profile Routes
    Route::get('/profile', [App\Http\Controllers\Organization\ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/organization/{id}', [App\Http\Controllers\Organization\ProfileController::class, 'showOrganization'])->name('profile.show-organization');
    Route::get('/profile/student/{id}', [App\Http\Controllers\Organization\ProfileController::class, 'showStudent'])->name('profile.show-student');
    Route::get('/profile/instructor/{id}', [App\Http\Controllers\Organization\ProfileController::class, 'showInstructor'])->name('profile.show-instructor');
    Route::get('/profile/club/{id}', [App\Http\Controllers\Organization\ProfileController::class, 'showClub'])->name('profile.show-club');

    // Organization Ratings
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'organizationIndex'])->name('ratings.index');

    // REMOVED: Organization Insights and Student Insights - Organizations cannot see financial analytics

    // Bank Information Routes
    Route::get('/bank-information', [App\Http\Controllers\Organization\BankInformationController::class, 'index'])->name('bank-information.index');
    Route::get('/bank-information/create', [App\Http\Controllers\Organization\BankInformationController::class, 'create'])->name('bank-information.create');
    Route::post('/bank-information', [App\Http\Controllers\Organization\BankInformationController::class, 'store'])->name('bank-information.store');
    Route::get('/bank-information/{bankInformation}/edit', [App\Http\Controllers\Organization\BankInformationController::class, 'edit'])->name('bank-information.edit');
    Route::put('/bank-information/{bankInformation}', [App\Http\Controllers\Organization\BankInformationController::class, 'update'])->name('bank-information.update');
    Route::delete('/bank-information/{bankInformation}', [App\Http\Controllers\Organization\BankInformationController::class, 'destroy'])->name('bank-information.destroy');
});

// Club routes
Route::middleware(['auth', 'role:club'])->prefix('club')->name('club.')->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Club\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/students', [App\Http\Controllers\Club\StudentController::class, 'index'])->name('students.index');
    Route::get('/students/create', [App\Http\Controllers\Club\StudentController::class, 'create'])->name('students.create');
    Route::post('/students', [App\Http\Controllers\Club\StudentController::class, 'store'])->name('students.store');
    Route::get('/students/{student}/edit', [App\Http\Controllers\Club\StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{student}', [App\Http\Controllers\Club\StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [App\Http\Controllers\Club\StudentController::class, 'destroy'])->name('students.destroy');
    Route::patch('/students/{student}/password', [App\Http\Controllers\Club\StudentController::class, 'updatePassword'])->name('students.updatePassword');

    Route::get('/payments', [App\Http\Controllers\Club\PaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/create', [App\Http\Controllers\Club\PaymentController::class, 'create'])->name('payments.create');
    Route::post('/payments', [App\Http\Controllers\Club\PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/bulk-generate', [App\Http\Controllers\Club\PaymentController::class, 'showBulkGenerate'])->name('payments.bulk-generate');
    Route::post('/payments/bulk-generate', [App\Http\Controllers\Club\PaymentController::class, 'bulkGenerate'])->name('payments.bulk-generate.store');
    Route::get('/payments/{payment}/edit', [App\Http\Controllers\Club\PaymentController::class, 'edit'])->name('payments.edit');
    Route::put('/payments/{payment}', [App\Http\Controllers\Club\PaymentController::class, 'update'])->name('payments.update');
    Route::delete('/payments/{payment}', [App\Http\Controllers\Club\PaymentController::class, 'destroy'])->name('payments.destroy');
    Route::patch('/payments/{payment}/status', [App\Http\Controllers\Club\PaymentController::class, 'updateStatus'])->name('payments.updateStatus');

    // Club Payment Attachment Routes
    Route::post('/payments/{payment}/upload-attachment', [App\Http\Controllers\Club\PaymentController::class, 'uploadAttachment'])->name('payments.upload-attachment');
    Route::get('/payment-attachments/{attachment}/download', [App\Http\Controllers\Club\PaymentController::class, 'downloadAttachment'])->name('payments.download-attachment');
    Route::delete('/payment-attachments/{attachment}', [App\Http\Controllers\Club\PaymentController::class, 'deleteAttachment'])->name('payments.delete-attachment');

    // Plans Routes
    Route::get('/plans', [App\Http\Controllers\Club\PlanController::class, 'index'])->name('plans.index');
    Route::get('/plans/create', [App\Http\Controllers\Club\PlanController::class, 'create'])->name('plans.create');
    Route::post('/plans', [App\Http\Controllers\Club\PlanController::class, 'store'])->name('plans.store');
    Route::get('/plans/{plan}/edit', [App\Http\Controllers\Club\PlanController::class, 'edit'])->name('plans.edit');
    Route::put('/plans/{plan}', [App\Http\Controllers\Club\PlanController::class, 'update'])->name('plans.update');
    Route::delete('/plans/{plan}', [App\Http\Controllers\Club\PlanController::class, 'destroy'])->name('plans.destroy');

    // Student Fee Plans Routes
    Route::get('/student-fee-plans', [App\Http\Controllers\Club\StudentFeePlanController::class, 'index'])->name('student-fee-plans.index');
    Route::get('/student-fee-plans/create', [App\Http\Controllers\Club\StudentFeePlanController::class, 'create'])->name('student-fee-plans.create');
    Route::post('/student-fee-plans', [App\Http\Controllers\Club\StudentFeePlanController::class, 'store'])->name('student-fee-plans.store');
    Route::get('/student-fee-plans/{studentFeePlan}/edit', [App\Http\Controllers\Club\StudentFeePlanController::class, 'edit'])->name('student-fee-plans.edit');
    Route::put('/student-fee-plans/{studentFeePlan}', [App\Http\Controllers\Club\StudentFeePlanController::class, 'update'])->name('student-fee-plans.update');
    Route::delete('/student-fee-plans/{studentFeePlan}', [App\Http\Controllers\Club\StudentFeePlanController::class, 'destroy'])->name('student-fee-plans.destroy');

    Route::get('/attendances', [App\Http\Controllers\Club\AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/attendances/create', [App\Http\Controllers\Club\AttendanceController::class, 'create'])->name('attendances.create');
    Route::post('/attendances', [App\Http\Controllers\Club\AttendanceController::class, 'store'])->name('attendances.store');
    Route::get('/attendances/{attendance}/edit', [App\Http\Controllers\Club\AttendanceController::class, 'edit'])->name('attendances.edit');
    Route::put('/attendances/{attendance}', [App\Http\Controllers\Club\AttendanceController::class, 'update'])->name('attendances.update');
    Route::delete('/attendances/{attendance}', [App\Http\Controllers\Club\AttendanceController::class, 'destroy'])->name('attendances.destroy');
    Route::post('/attendances/toggle', [App\Http\Controllers\Club\AttendanceController::class, 'toggle'])->name('attendances.toggle');

    Route::get('/instructors', [App\Http\Controllers\Club\InstructorController::class, 'index'])->name('instructors.index');
    Route::get('/instructors/create', [App\Http\Controllers\Club\InstructorController::class, 'create'])->name('instructors.create');
    Route::post('/instructors', [App\Http\Controllers\Club\InstructorController::class, 'store'])->name('instructors.store');
    Route::get('/instructors/{instructor}/edit', [App\Http\Controllers\Club\InstructorController::class, 'edit'])->name('instructors.edit');
    Route::put('/instructors/{instructor}', [App\Http\Controllers\Club\InstructorController::class, 'update'])->name('instructors.update');
    Route::delete('/instructors/{instructor}', [App\Http\Controllers\Club\InstructorController::class, 'destroy'])->name('instructors.destroy');

    Route::get('/certifications', [\App\Http\Controllers\Club\CertificationController::class, 'index'])->name('certifications.index');
    Route::get('/certifications/create', [\App\Http\Controllers\Club\CertificationController::class, 'create'])->name('certifications.create');
    Route::post('/certifications', [\App\Http\Controllers\Club\CertificationController::class, 'store'])->name('certifications.store');
    Route::get('/certifications/{certification}/edit', [\App\Http\Controllers\Club\CertificationController::class, 'edit'])->name('certifications.edit');
    Route::put('/certifications/{certification}', [\App\Http\Controllers\Club\CertificationController::class, 'update'])->name('certifications.update');
    Route::delete('/certifications/{certification}', [App\Http\Controllers\Club\CertificationController::class, 'destroy'])->name('certifications.destroy');

    // Club Event Routes
    Route::get('/events', [\App\Http\Controllers\Club\EventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [\App\Http\Controllers\Club\EventController::class, 'create'])->name('events.create');
    Route::post('/events', [\App\Http\Controllers\Club\EventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}/edit', [\App\Http\Controllers\Club\EventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [\App\Http\Controllers\Club\EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event}', [\App\Http\Controllers\Club\EventController::class, 'destroy'])->name('events.destroy');

    // Club Profile Routes
    Route::get('/profile', [App\Http\Controllers\Club\ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/club/{id}', [App\Http\Controllers\Club\ProfileController::class, 'showClub'])->name('profile.show-club');
    Route::get('/profile/student/{id}', [App\Http\Controllers\Club\ProfileController::class, 'showStudent'])->name('profile.show-student');
    Route::get('/profile/instructor/{id}', [App\Http\Controllers\Club\ProfileController::class, 'showInstructor'])->name('profile.show-instructor');
    Route::get('/profile/organization/{id}', [App\Http\Controllers\Club\ProfileController::class, 'showOrganization'])->name('profile.show-organization');

    // Club Ratings
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'clubIndex'])->name('ratings.index');

    // Club Insights
    Route::get('/insights', [App\Http\Controllers\Club\ClubInsightsController::class, 'show'])->name('insights.show');

    // Club Student Insights
    Route::get('/student-insights/{student}', [App\Http\Controllers\Club\StudentInsightsController::class, 'show'])->name('student-insights.show');

    // Bank Information Routes
    Route::get('/bank-information', [App\Http\Controllers\Club\BankInformationController::class, 'index'])->name('bank-information.index');
    Route::get('/bank-information/create', [App\Http\Controllers\Club\BankInformationController::class, 'create'])->name('bank-information.create');
    Route::post('/bank-information', [App\Http\Controllers\Club\BankInformationController::class, 'store'])->name('bank-information.store');
    Route::get('/bank-information/{bankInformation}/edit', [App\Http\Controllers\Club\BankInformationController::class, 'edit'])->name('bank-information.edit');
    Route::put('/bank-information/{bankInformation}', [App\Http\Controllers\Club\BankInformationController::class, 'update'])->name('bank-information.update');
    Route::delete('/bank-information/{bankInformation}', [App\Http\Controllers\Club\BankInformationController::class, 'destroy'])->name('bank-information.destroy');
});

// Student routes
Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/payments', [App\Http\Controllers\Student\PaymentController::class, 'index'])->name('payments.index');
    Route::get('/fee-plan', [App\Http\Controllers\Student\StudentFeePlanController::class, 'show'])->name('fee-plan.show');

    // Student Payment Attachment Routes
    Route::post('/payments/{payment}/upload-attachment', [App\Http\Controllers\Student\PaymentController::class, 'uploadAttachment'])->name('payments.upload-attachment');
    Route::get('/payment-attachments/{attachment}/download', [App\Http\Controllers\Student\PaymentController::class, 'downloadAttachment'])->name('payments.download-attachment');
    Route::delete('/payment-attachments/{attachment}', [App\Http\Controllers\Student\PaymentController::class, 'deleteAttachment'])->name('payments.delete-attachment');

    Route::get('/attendances', [App\Http\Controllers\Student\AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/certifications', [App\Http\Controllers\Student\CertificationController::class, 'index'])->name('certifications.index');

    // Student Event Routes
    Route::get('/events', [App\Http\Controllers\Student\EventController::class, 'index'])->name('events.index');
    Route::get('/events/{event}', [App\Http\Controllers\Student\EventController::class, 'show'])->name('events.show');
    Route::get('/profile', [App\Http\Controllers\Student\ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/student/{id}', [App\Http\Controllers\Student\ProfileController::class, 'showStudent'])->name('profile.show-student');
    Route::get('/profile/instructor/{id}', [App\Http\Controllers\Student\ProfileController::class, 'showInstructor'])->name('profile.show-instructor');

    // Student Ratings
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'index'])->name('ratings.index');

    // Student Student Insights
    Route::get('/student-insights', [App\Http\Controllers\Student\StudentInsightsController::class, 'show'])->name('student-insights.show');
});

// Guardian routes
Route::middleware(['auth', 'role:guardian'])->prefix('guardian')->name('guardian.')->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Guardian\DashboardController::class, 'index'])->name('dashboard');
});

// Instructor routes
Route::middleware(['auth', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Instructor\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/students', [App\Http\Controllers\Instructor\StudentController::class, 'index'])->name('students.index');
    Route::get('/students/{id}/edit', [App\Http\Controllers\Instructor\StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{id}', [App\Http\Controllers\Instructor\StudentController::class, 'update'])->name('students.update');
    Route::get('/profile', [App\Http\Controllers\Instructor\ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/instructor/{id}', [App\Http\Controllers\Instructor\ProfileController::class, 'showInstructor'])->name('profile.show-instructor');
    Route::get('/profile/student/{id}', [App\Http\Controllers\Instructor\ProfileController::class, 'showStudent'])->name('profile.show-student');

    // Instructor Attendances
    Route::get('/attendances', [App\Http\Controllers\Instructor\AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/attendances/create', [App\Http\Controllers\Instructor\AttendanceController::class, 'create'])->name('attendances.create');
    Route::post('/attendances', [App\Http\Controllers\Instructor\AttendanceController::class, 'store'])->name('attendances.store');
    Route::get('/attendances/{attendance}/edit', [App\Http\Controllers\Instructor\AttendanceController::class, 'edit'])->name('attendances.edit');
    Route::put('/attendances/{attendance}', [App\Http\Controllers\Instructor\AttendanceController::class, 'update'])->name('attendances.update');
    Route::delete('/attendances/{attendance}', [App\Http\Controllers\Instructor\AttendanceController::class, 'destroy'])->name('attendances.destroy');
    Route::post('/attendances/toggle', [App\Http\Controllers\Instructor\AttendanceController::class, 'toggle'])->name('attendances.toggle');

    // Instructor Insights
    Route::get('/insights', [App\Http\Controllers\Instructor\InstructorInsightsController::class, 'show'])->name('insights.show');

    // Instructor Student Insights
});

// Rating routes (accessible by all authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::post('/ratings', [App\Http\Controllers\RatingController::class, 'store'])->name('ratings.store');
    Route::put('/ratings/{rating}', [App\Http\Controllers\RatingController::class, 'update'])->name('ratings.update');
    Route::delete('/ratings/{rating}', [App\Http\Controllers\RatingController::class, 'destroy'])->name('ratings.destroy');
});

require __DIR__ . '/auth.php';
