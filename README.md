# Taekwondo Web Application

A comprehensive web application for managing Taekwondo clubs, organizations, and students with role-based authentication.

## Features

-   **Role-Based Authentication System** with 6 distinct user types
-   **Separate Login Routes** for each user role
-   **Central Role Selection** at `/login`
-   **Secure Guard-Based Authentication** for each role
-   **Modern UI** built with React, Inertia.js, and Tailwind CSS

## User Types

The application supports the following user roles:

1. **Admin** - System administrators with full access
2. **Organization** - Organization management and oversight
3. **Club** - Club management and operations
4. **Instructor** - Teaching and student management
5. **Student** - Student access and learning
6. **Guardian** - Parent/guardian access

## Authentication System

### Separate Login Routes

Each user type has its own dedicated login route:

-   **Admin**: `/admin/login`
-   **Organization**: `/organization/login`
-   **Club**: `/club/login`
-   **Instructor**: `/instructor/login`
-   **Student**: `/student/login`
-   **Guardian**: `/guardian/login`

### Central Role Selection

The main `/login` route now serves as a role selection page where users choose their role before being redirected to the appropriate login form.

### How It Works

1. **User visits `/login`** - Sees a beautiful role selection interface
2. **User selects their role** - Gets redirected to the role-specific login page
3. **User enters credentials** - Authenticates using the appropriate guard
4. **User is redirected** - To their role-specific dashboard

## Installation

1. Clone the repository
2. Install PHP dependencies: `composer install`
3. Install Node.js dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure
5. Generate application key: `php artisan key:generate`
6. Run migrations: `php artisan migrate`
7. Build assets: `npm run build`

## Usage

### Using the User Model

```php
// Check if user has any of the specified roles
$user->hasAnyOfRoles(['admin', 'organization']);

// Check if user has all of the specified roles
$user->hasAllOfRoles(['admin', 'organization']);

// Check if user has a specific role
$user->role === 'admin';

// Get user's role
$user->role; // Returns: 'admin', 'organization', 'club', 'instructor', 'student', or 'guardian'
```

### Authentication Guards

Each role uses a dedicated authentication guard:

```php
// Authenticate as admin
Auth::guard('admin')->attempt($credentials);

// Check if admin is authenticated
Auth::guard('admin')->check();

// Get authenticated admin user
$admin = Auth::guard('admin')->user();
```

### Route Protection

Protect routes using role-specific middleware:

```php
Route::middleware('auth:admin')->group(function () {
    // Admin-only routes
});

Route::middleware('auth:organization')->group(function () {
    // Organization-only routes
});
```

## File Structure

```
app/
├── Http/Controllers/Auth/
│   ├── AdminLoginController.php
│   ├── OrganizationLoginController.php
│   ├── ClubLoginController.php
│   ├── InstructorLoginController.php
│   ├── StudentLoginController.php
│   └── GuardianLoginController.php
├── Models/
│   └── User.php (with role-based traits)
├── Providers/
│   ├── AuthServiceProvider.php
│   └── RouteServiceProvider.php
└── Services/
    └── AuthService.php

resources/
├── js/pages/auth/
│   ├── login.tsx (role selection)
│   ├── admin-login.tsx
│   ├── organization-login.tsx
│   ├── club-login.tsx
│   ├── instructor-login.tsx
│   ├── student-login.tsx
│   └── guardian-login.tsx
└── views/auth/
    ├── admin-login.blade.php
    ├── organization-login.blade.php
    ├── club-login.blade.php
    ├── instructor-login.blade.php
    ├── student-login.blade.php
    └── guardian-login.blade.php
```

## Configuration

### Auth Configuration (`config/auth.php`)

```php
'guards' => [
    'web' => ['driver' => 'session', 'provider' => 'users'],
    'admin' => ['driver' => 'session', 'provider' => 'users'],
    'organization' => ['driver' => 'session', 'provider' => 'users'],
    'club' => ['driver' => 'session', 'provider' => 'users'],
    'student' => ['driver' => 'session', 'provider' => 'users'],
    'guardian' => ['driver' => 'session', 'provider' => 'users'],
    'instructor' => ['driver' => 'session', 'provider' => 'users'],
],
```

### Route Service Provider

Contains constants for each role's home route:

```php
public const ADMIN_HOME = '/admin/dashboard';
public const ORGANIZATION_HOME = '/organization/dashboard';
public const CLUB_HOME = '/club/dashboard';
public const INSTRUCTOR_HOME = '/instructor/dashboard';
public const STUDENT_HOME = '/student/dashboard';
public const GUARDIAN_HOME = '/guardian/dashboard';
```

## Benefits of This Approach

1. **Clear Separation**: Each user type has its own login experience
2. **No Middleware Conflicts**: Users can access login pages without authentication issues
3. **Better UX**: Users know exactly which system they're logging into
4. **Maintainable**: Each login flow is independent and easy to customize
5. **Secure**: Role-specific authentication guards prevent unauthorized access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
