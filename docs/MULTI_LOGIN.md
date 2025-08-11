# Multi-Login System

## Overview

The Multi-Login System allows users to authenticate with multiple roles simultaneously in the same browser session. This system solves the common issue where users need to access different user types without logging out and back in.

## How It Works

### Multiple Guards Approach
- Each user type has its own authentication guard (admin, organization, club, student, guardian, instructor)
- Users can be authenticated to multiple guards at the same time
- Session management keeps track of all active logins
- Users can switch between active roles seamlessly

### Session Management
- Laravel sessions store authentication state for each guard
- The `MultiLoginService` manages multiple guard authentications
- Users can see all their active logins and switch between them

## Solution to the Login Route Issue

### Problem
When a user is already logged in and tries to access `/login` for a second user login, the existing middleware redirects them to the dashboard, preventing multiple logins.

### Solution
Instead of creating separate login pages for each user type, we implemented:

1. **Keep the existing `/login` route** - for initial authentication
2. **Add `/multi-login` route** - for logging into multiple roles simultaneously
3. **Role Switcher Component** - for switching between active logins
4. **No middleware conflicts** - the multi-login route works independently

### Benefits of This Approach
- ✅ **No duplicate login pages** - clean, maintainable code
- ✅ **Better user experience** - users can see all available roles at once
- ✅ **No middleware conflicts** - existing authentication flow remains intact
- ✅ **Flexible** - users can login to multiple roles or just one
- ✅ **Professional UI** - modern, intuitive interface

## Usage

### For Users

#### Option 1: Multi-Role Login
1. Navigate to `/multi-login`
2. Enter your email and password
3. Select multiple roles you want to login to
4. Click "Login to X Roles"
5. You're now authenticated to all selected roles

#### Option 2: Single Role Login
1. Navigate to `/multi-login`
2. Switch to "Single Role Login" tab
3. Enter credentials and select specific role
4. Click "Login as [Role]"

#### Switching Between Roles
1. Use the Role Switcher dropdown in the dashboard header
2. Select the role you want to switch to
3. The page refreshes with the new role context

### For Developers

#### Frontend Components
- `MultiLogin` - Main multi-login page with tabs
- `RoleSwitcher` - Dropdown for switching between active roles
- `DashboardHeader` - Header with role switcher integration

#### Backend Services
- `MultiLoginService` - Core logic for multi-guard authentication
- `MultiLoginController` - API endpoints for multi-login functionality

## API Endpoints

### Guest Routes (No Authentication Required)
- `GET /multi-login` - Show multi-login form
- `POST /multi-login` - Login to multiple roles
- `POST /login-guard` - Login to specific role

### Authenticated Routes (Requires Authentication)
- `POST /switch-guard` - Switch to different active guard
- `GET /active-logins` - Get list of active logins
- `POST /logout-guard` - Logout from specific guard
- `POST /logout-all-guards` - Logout from all guards

## Implementation Details

### Session Storage
```php
// Each guard stores its authentication state separately
Session::put("auth.{$guard}", $user);
```

### Guard Switching
```php
// Switch active guard without losing other logins
Auth::setDefaultDriver($guard);
Session::put('current_guard', $guard);
```

### Multiple Authentication
```php
// Authenticate to multiple guards simultaneously
foreach ($roles as $role) {
    if (Auth::guard($role)->attempt($credentials)) {
        $activeLogins[$role] = Auth::guard($role)->user();
    }
}
```

## Security Considerations

### Authentication Validation
- Each login attempt validates credentials against the specific role
- Users can only login to roles they actually have access to
- Session data is properly isolated between guards

### Session Management
- Sessions are tied to specific guards
- Logout from one guard doesn't affect others
- Proper cleanup when logging out from all guards

### Access Control
- Role-based middleware still works as expected
- Users can only access resources for their current active role
- Switching roles updates the authentication context

## Best Practices

### For Users
1. **Use multi-login for testing** - Login to multiple roles when you need to test different user experiences
2. **Regular cleanup** - Logout from unused roles to keep sessions clean
3. **Role awareness** - Always check which role you're currently using

### For Developers
1. **Guard consistency** - Always use the appropriate guard for role-specific operations
2. **Session handling** - Properly manage session data for multiple guards
3. **Error handling** - Gracefully handle cases where a guard is not authenticated

## Troubleshooting

### Common Issues

#### "Guard not available" Error
- Ensure the user is authenticated to the specific guard
- Check if the guard exists in the auth configuration
- Verify the user has the required role

#### Session Conflicts
- Each guard uses separate session keys
- No cross-contamination between different role sessions
- Clear browser cache if issues persist

#### Role Switching Not Working
- Ensure the target guard is authenticated
- Check if the user has access to that role
- Verify the session data is properly stored

### Debug Information
```php
// Check active logins
$activeLogins = MultiLoginService::getActiveLogins();

// Check current guard
$currentGuard = MultiLoginService::getCurrentGuard();

// Verify guard authentication
$isAuthenticated = MultiLoginService::isGuardAuthenticated($guard);
```

## Future Enhancements

### Planned Features
- **Role-based UI customization** - Different layouts for different roles
- **Permission inheritance** - Access to multiple role permissions simultaneously
- **Audit logging** - Track role switching and multi-login activities
- **Session timeout management** - Different timeout rules for different roles

### Integration Opportunities
- **Single Sign-On (SSO)** - Integrate with external authentication providers
- **Role-based notifications** - Different notification systems per role
- **Custom dashboards** - Tailored dashboard experiences for each role
