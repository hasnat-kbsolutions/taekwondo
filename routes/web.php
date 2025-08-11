<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Exports\StudentsExport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

Route::get('/invoice', function () {
    return Inertia::render('Admin/Payments/Invoice');
});

Route::get('/', function () {
    return redirect('/login');
})->middleware('redirect.role');


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

    Route::get('/payments', [App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/create', [App\Http\Controllers\Admin\PaymentController::class, 'create'])->name('payments.create');
    Route::post('/payments', [App\Http\Controllers\Admin\PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}/edit', [App\Http\Controllers\Admin\PaymentController::class, 'edit'])->name('payments.edit');
    Route::put('/payments/{payment}', [App\Http\Controllers\Admin\PaymentController::class, 'update'])->name('payments.update');
    Route::delete('/payments/{payment}', [App\Http\Controllers\Admin\PaymentController::class, 'destroy'])->name('payments.destroy');
    Route::get('/payments/{payment}/invoice', [App\Http\Controllers\Admin\PaymentController::class, 'invoice'])->name('payments.invoice');

    // Admin Ratings
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'adminIndex'])->name('ratings.index');
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

    Route::get('/payments', [App\Http\Controllers\Organization\PaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/create', [App\Http\Controllers\Organization\PaymentController::class, 'create'])->name('payments.create');
    Route::post('/payments', [App\Http\Controllers\Organization\PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}/edit', [App\Http\Controllers\Organization\PaymentController::class, 'edit'])->name('payments.edit');
    Route::put('/payments/{payment}', [App\Http\Controllers\Organization\PaymentController::class, 'update'])->name('payments.update');
    Route::delete('/payments/{payment}', [App\Http\Controllers\Organization\PaymentController::class, 'destroy'])->name('payments.destroy');
    Route::get('/payments/{payment}/invoice', [App\Http\Controllers\Organization\PaymentController::class, 'invoice'])->name('payments.invoice');

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

    Route::get('/payments', [App\Http\Controllers\Club\PaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/create', [App\Http\Controllers\Club\PaymentController::class, 'create'])->name('payments.create');
    Route::post('/payments', [App\Http\Controllers\Club\PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}/edit', [App\Http\Controllers\Club\PaymentController::class, 'edit'])->name('payments.edit');
    Route::put('/payments/{payment}', [App\Http\Controllers\Club\PaymentController::class, 'update'])->name('payments.update');
    Route::delete('/payments/{payment}', [App\Http\Controllers\Club\PaymentController::class, 'destroy'])->name('payments.destroy');
    Route::get('/payments/{payment}/invoice', [App\Http\Controllers\Club\PaymentController::class, 'invoice'])->name('payments.invoice');

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

    // Club Profile Routes
    Route::get('/profile', [App\Http\Controllers\Club\ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/club/{id}', [App\Http\Controllers\Club\ProfileController::class, 'showClub'])->name('profile.show-club');
    Route::get('/profile/student/{id}', [App\Http\Controllers\Club\ProfileController::class, 'showStudent'])->name('profile.show-student');
    Route::get('/profile/instructor/{id}', [App\Http\Controllers\Club\ProfileController::class, 'showInstructor'])->name('profile.show-instructor');
    Route::get('/profile/organization/{id}', [App\Http\Controllers\Club\ProfileController::class, 'showOrganization'])->name('profile.show-organization');

    // Club Ratings
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'clubIndex'])->name('ratings.index');



});

// Student routes
Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/payments', [App\Http\Controllers\Student\PaymentController::class, 'index'])->name('payments.index');
    Route::get('/attendances', [App\Http\Controllers\Student\AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/certifications', [App\Http\Controllers\Student\CertificationController::class, 'index'])->name('certifications.index');
    Route::get('/profile', [App\Http\Controllers\Student\ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/student/{id}', [App\Http\Controllers\Student\ProfileController::class, 'showStudent'])->name('profile.show-student');
    Route::get('/profile/instructor/{id}', [App\Http\Controllers\Student\ProfileController::class, 'showInstructor'])->name('profile.show-instructor');

    // Student Ratings
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'index'])->name('ratings.index');
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

    // Instructor Ratings
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'index'])->name('ratings.index');
});

// Rating routes (accessible by all authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::post('/ratings', [App\Http\Controllers\RatingController::class, 'store'])->name('ratings.store');
    Route::put('/ratings/{rating}', [App\Http\Controllers\RatingController::class, 'update'])->name('ratings.update');
    Route::delete('/ratings/{rating}', [App\Http\Controllers\RatingController::class, 'destroy'])->name('ratings.destroy');
});

require __DIR__ . '/auth.php';
