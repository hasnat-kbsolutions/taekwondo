# Role-Based Authentication System

This document explains how to use the role-based authentication system in the Taekwondo web application.

## Overview

The application supports 6 user types, each with their own authentication guard and permissions:

-   **Admin** - Full system access
-   **Organization** - Organization-level administration
-   **Club** - Club-level management
-   **Instructor** - Taekwondo instructor
-   **Student** - Individual student
-   **Guardian** - Parent/guardian of student

## Configuration Files

### 1. `config/auth.php`

Contains authentication guards for each user type:

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

### 2. `config/roles.php`

Defines roles, permissions, and hierarchical relationships.

## Usage Examples

### In Controllers

```php
use App\Services\AuthService;

class SomeController extends Controller
{
    public function index()
    {
        // Check if user has specific role
        if (!AuthService::hasRole('admin')) {
            abort(403);
        }

        // Check if user has any of multiple roles
        if (!AuthService::hasAnyRole(['admin', 'organization'])) {
            abort(403);
        }

        // Get current user with role guard
        $user = AuthService::getCurrentUser();

        return view('some.view');
    }
}
```

### In Blade Templates

```php
@if(AuthService::hasRole('admin'))
    <div>Admin only content</div>
@endif

@if(AuthService::hasAnyRole(['admin', 'organization']))
    <div>Admin or Organization content</div>
@endif
```

### In Routes

```php
// Using middleware
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
});

// Using gates
Route::get('/admin', function () {
    if (Gate::allows('admin-access')) {
        return view('admin.dashboard');
    }
    abort(403);
})->middleware('auth');
```

### Using the User Model

```php
$user = Auth::user();

// Check roles
if ($user->isAdmin()) {
    // Admin logic
}

if ($user->isOrganization()) {
    // Organization logic
}

// Get dashboard route
$dashboardRoute = $user->getDashboardRoute();

// Check multiple roles
if ($user->hasAnyOfRoles(['admin', 'organization'])) {
    // Logic for admin or organization
}
```

## Middleware

### RoleGuardMiddleware

```php
Route::middleware(['auth', 'role.guard:admin'])->group(function () {
    // Admin routes
});
```

### RoleMiddleware (existing)

```php
Route::middleware(['auth', 'role:admin,organization'])->group(function () {
    // Routes accessible by admin or organization
});
```

## Gates and Policies

The system defines several gates for authorization:

```php
// Check if user can access admin features
if (Gate::allows('admin-access')) {
    // Admin access granted
}

// Check if user can access organization features
if (Gate::allows('organization-access')) {
    // Organization access granted
}
```

## Authentication Flow

1. User logs in with email/password
2. System authenticates with `web` guard
3. System checks user role
4. System switches to role-specific guard
5. User is redirected to appropriate dashboard

## Logout

The system automatically logs out from all guards:

```php
use App\Services\AuthService;

AuthService::logout();
```

## Best Practices

1. **Always check roles** before allowing access to sensitive operations
2. **Use middleware** for route-level protection
3. **Use gates** for complex authorization logic
4. **Use the AuthService** for consistent authentication operations
5. **Test role-based access** thoroughly

## Security Notes

-   Each role has its own authentication guard
-   Role hierarchy is enforced at multiple levels
-   Session-based authentication is used for all guards
-   Password reset tokens are role-specific
-   All authentication attempts are logged

## Troubleshooting

### Common Issues

1. **User not redirected properly**: Check if the role has a valid dashboard route
2. **Permission denied**: Verify user role and required permissions
3. **Guard not working**: Ensure the guard is properly configured in `config/auth.php`

### Debug Commands

```bash
# Check current user and role
php artisan tinker
>>> Auth::user()->role

# Check guard status
>>> Auth::getDefaultDriver()
>>> Auth::guard('admin')->check()
```
