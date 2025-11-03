# Software Flow Analysis

## Application Architecture

### Technology Stack

-   **Backend**: Laravel 12 (PHP 8.2+)
-   **Frontend**: React 18 with TypeScript
-   **Integration**: Inertia.js (bridges Laravel and React)
-   **UI Framework**: Tailwind CSS with shadcn/ui components
-   **Authentication**: Laravel Sanctum with custom role-based guards
-   **Authorization**: Spatie Laravel Permission package
-   **Additional**: DomPDF (invoices), Maatwebsite Excel (exports)

### Key Architecture Patterns

-   **MVC Pattern**: Traditional Laravel MVC structure
-   **Service Layer**: `AuthService` for authentication logic
-   **Polymorphic Relations**: Users are linked to different entities (Admin, Organization, Club, Student, Instructor) via `userable` morph relation
-   **Role-Based Access Control**: Multiple authentication guards per role

---

## Request Flow Overview

```
User Request → Web Server → Laravel Routes → Middleware → Controller → Inertia Response → React Component → User Interface
```

---

## Detailed Request Flow

### 1. **Initial Request Entry**

```
User Browser
  ↓
Laravel Public Entry Point (public/index.php)
  ↓
Kernel Bootstrap (bootstrap/app.php)
  ↓
HTTP Kernel (app/Http/Kernel.php)
  ↓
Route Matching (routes/web.php or routes/auth.php)
```

### 2. **Route Processing**

Routes are organized by user role:

**Main Routes (`routes/web.php`)**:

-   `/` → Redirects to `/login` with role-based redirect middleware
-   Role-specific route groups:
    -   `/admin/*` → Admin routes (middleware: `auth`, `role:admin`)
    -   `/organization/*` → Organization routes (middleware: `auth`, `role:organization`)
    -   `/club/*` → Club routes (middleware: `auth`, `role:club`)
    -   `/student/*` → Student routes (middleware: `auth`, `role:student`)
    -   `/instructor/*` → Instructor routes (middleware: `auth`, `role:instructor`)
    -   `/guardian/*` → Guardian routes (middleware: `auth`, `role:guardian`)

**Auth Routes (`routes/auth.php`)**:

-   `/login` → Role selection page
-   `/admin/login` → Admin login
-   `/organization/login` → Organization login
-   `/club/login` → Club login
-   `/instructor/login` → Instructor login
-   `/student/login` → Student login

### 3. **Middleware Stack**

**Global Middleware**:

1. `StartSession` - Initialize session
2. `ShareErrorsFromSession` - Share validation errors
3. `VerifyCsrfToken` - CSRF protection
4. `HandleInertiaRequests` - Share data with React frontend

**Route Middleware**:

-   `auth` - Verify user authentication
-   `role:admin|organization|club|student|instructor|guardian` - Verify user role
-   `RedirectBasedOnRole` - Redirect authenticated users based on role
-   `AllowLoginWhenAuthenticated` - Allow access to login pages even when authenticated

### 4. **Controller Processing**

**Typical Controller Flow**:

```php
Controller Method
  ↓
Validate Request (Form Requests)
  ↓
Business Logic (Service Layer if needed)
  ↓
Database Operations (Eloquent Models)
  ↓
Return Inertia Response
```

**Example: Admin Dashboard**

```
GET /admin/dashboard
  ↓
Admin\DashboardController@index
  ↓
Fetch data (students, payments, etc.)
  ↓
Inertia::render('Admin/Dashboard', ['data' => ...])
```

---

## Authentication Flow

### Login Process

#### Step 1: User Accesses Login

```
GET /login
  ↓
AuthenticatedSessionController@create
  ↓
Returns: Inertia::render('auth/login')
  ↓
React: Login page with role selection
```

#### Step 2: User Selects Role

```
User clicks "Admin Login" / "Organization Login" / etc.
  ↓
GET /admin/login (or respective role)
  ↓
AdminLoginController@create
  ↓
Returns: Inertia::render('auth/admin-login')
```

#### Step 3: User Submits Credentials

```
POST /admin/login
  ↓
AdminLoginController@store
  ↓
LoginRequest (validates email/password)
  ↓
AuthService::clearForNewRole() (clears existing sessions)
  ↓
LoginRequest::authenticateWithRole('admin')
  ↓
AuthService::authenticateWithRole($email, $password, 'admin')
  ↓
  ├─ Auth::guard('web')->attempt() (authenticate with web guard)
  ├─ Check user.role === 'admin'
  └─ Auth::shouldUse('admin') (switch to admin guard)
  ↓
Session regeneration
  ↓
Redirect to: RouteServiceProvider::ADMIN_HOME (/admin/dashboard)
```

### Authentication Guards

The application uses **multiple authentication guards** for the same User model:

```php
'guards' => [
    'web' => ['driver' => 'session', 'provider' => 'users'],
    'admin' => ['driver' => 'session', 'provider' => 'users'],
    'organization' => ['driver' => 'session', 'provider' => 'users'],
    'club' => ['driver' => 'session', 'provider' => 'users'],
    'student' => ['driver' => 'session', 'provider' => 'users'],
    'guardian' => ['driver' => 'session', 'provider' => 'users'],
    'instructor' => ['driver' => 'session', 'provider' => 'users'],
]
```

**Key Point**: All guards use the same provider (`users`), meaning they authenticate against the same `users` table, but each guard maintains separate session state.

### User Model Structure

**User Table**:

-   `id` - Primary key
-   `email` - Login identifier
-   `password` - Hashed password
-   `role` - User role (admin, organization, club, student, instructor, guardian)
-   `userable_type` - Polymorphic type (App\Models\Admin, App\Models\Organization, etc.)
-   `userable_id` - Polymorphic foreign key

**Polymorphic Relationship**:

```php
User → userable() → Admin | Organization | Club | Student | Instructor | Guardian
```

This allows a single User model to represent different entity types while maintaining separate data tables.

---

## Frontend-Backend Communication (Inertia.js)

### How Inertia Works

Inertia.js bridges Laravel and React without requiring a REST API. It uses traditional server-side routing with modern client-side rendering.

#### Request Flow:

```
1. User clicks link or submits form
2. Axios sends request to Laravel route
3. Laravel Controller processes request
4. Controller returns Inertia::render('PageName', { props })
5. Inertia middleware wraps response
6. React receives JSON response with page component name and props
7. React renders the component with the props
```

#### Shared Data (HandleInertiaRequests Middleware)

**Always Available Props**:

```php
{
  auth: {
    user: {
      id, email, role, userable_type, userable: { id, name, logo, type }
    }
  },
  flash: {
    success, error, import_log
  },
  ziggy: { /* route helper data */ }
}
```

#### Page Props (Controller-Specific)

```php
Inertia::render('Admin/Dashboard', [
  'students' => Student::all(),
  'payments' => Payment::all(),
  // ... other data
])
```

These props are passed directly to the React component as props.

---

## Data Flow: CRUD Operations

### Example: Creating a Student (Admin)

#### Frontend (React)

```
User fills form → Submit → router.post('/admin/students', formData)
```

#### Backend (Laravel)

```
POST /admin/students
  ↓
Route: admin.students.store
  ↓
Middleware: ['auth', 'role:admin']
  ↓
Admin\StudentController@store
  ↓
Validate Request (StudentStoreRequest)
  ↓
Create User with role='student'
  ↓
Create Student model
  ↓
Link User to Student (userable relationship)
  ↓
Return redirect('/admin/students')
  ↓
Backend returns Inertia response for students index page
  ↓
Frontend receives new page with updated student list
```

### File Upload Flow

Example: Payment Attachment

```
POST /admin/payments/{payment}/upload-attachment
  ↓
Admin\PaymentController@uploadAttachment
  ↓
Store file (StorageService)
  ↓
Create PaymentAttachment record
  ↓
Return success response
```

---

## Role-Based Access Control (RBAC)

### Role Hierarchy (Implicit)

```
Admin (full access)
  ↓
Organization (manages organizations, clubs, students)
  ↓
Club (manages club students, payments, attendance)
  ↓
Instructor (manages assigned students, attendance)
  ↓
Student (views own data)
```

### Authorization Checks

**Route-Level**:

```php
Route::middleware(['auth', 'role:admin'])
```

-   Checks if user is authenticated
-   Checks if user.role === 'admin'

**Controller-Level**:

```php
if (!AuthService::hasRole('admin')) {
    abort(403);
}
```

**Gate-Level** (AuthServiceProvider):

```php
Gate::define('admin-access', fn(User $user) => $user->role === 'admin');
Gate::define('organization-access', fn(User $user) =>
    in_array($user->role, ['admin', 'organization']));
```

---

## Frontend Flow (React)

### Application Bootstrap

```
resources/js/app.tsx
  ↓
createInertiaApp()
  ↓
Resolve page components from resources/js/pages/
  ↓
Render with ThemeProvider
  ↓
Inertia Router handles navigation
```

### Page Components Structure

```
resources/js/pages/
  ├── Admin/
  │   ├── Dashboard.tsx
  │   ├── Students/
  │   │   ├── Index.tsx
  │   │   ├── Create.tsx
  │   │   └── Edit.tsx
  ├── Organization/
  ├── Club/
  ├── Student/
  ├── Instructor/
  └── Auth/
      ├── Login.tsx
      ├── AdminLogin.tsx
      └── ...
```

### Component Communication

-   **Props**: Data passed from Laravel via Inertia
-   **router**: Inertia router for navigation and form submissions
-   **useForm**: Inertia hook for form handling with validation
-   **usePage**: Access shared Inertia props (auth, flash messages)

---

## Session Management

### Session Storage

-   Driver: `file` or `database` (configurable)
-   Session data includes:
    -   Authentication state per guard
    -   CSRF token
    -   Flash messages
    -   User preferences

### Multi-Guard Sessions

The application maintains separate authentication state for each guard:

-   User can be authenticated as 'admin' in `admin` guard
-   Same user can be authenticated as 'organization' in `organization` guard
-   Each guard's session is independent

---

## Error Handling Flow

### Validation Errors

```
Form submission with invalid data
  ↓
Laravel Validation fails
  ↓
Redirect back with errors
  ↓
Inertia shares errors in props
  ↓
React component displays errors via useForm().errors
```

### Authorization Errors

```
Unauthorized access attempt
  ↓
Middleware: abort(403)
  ↓
Inertia error page rendered
```

### Exception Handling

-   Laravel's exception handler catches errors
-   Development: Detailed error pages
-   Production: Generic error pages (configurable)

---

## Asset Pipeline

### Development

```
Vite Dev Server
  ↓
Hot Module Replacement (HMR)
  ↓
Real-time updates to React components
```

### Production

```
npm run build
  ↓
Vite compiles TypeScript → JavaScript
  ↓
Tailwind compiles CSS
  ↓
Assets stored in public/build/
  ↓
Laravel serves compiled assets
```

---

## Database Interaction

### Eloquent Models

-   Models located in `app/Models/`
-   Relationships defined:
    -   `User` → `userable()` (polymorphic)
    -   `Student` → `club()`, `organization()`, `instructor()`
    -   `Payment` → `student()`, `club()`, `organization()`
    -   `Attendance` → `student()`, `instructor()`
    -   etc.

### Query Flow

```
Controller
  ↓
Eloquent Query (Student::with('club')->get())
  ↓
Database Query Builder
  ↓
MySQL/PostgreSQL Database
  ↓
Results serialized to JSON
  ↓
Passed to Inertia
  ↓
Sent to React as props
```

---

## Export/Import Flow

### Student Export (Example)

```
GET /admin/students/export
  ↓
Admin\StudentController@export
  ↓
Excel::download(new StudentsExport, 'students.xlsx')
  ↓
Maatwebsite Excel generates file
  ↓
File downloaded to user
```

### Import (If Implemented)

```
POST /admin/students/import
  ↓
Excel::import(new StudentsImport, $file)
  ↓
Process rows
  ↓
Create/Update records
  ↓
Return with import log
```

---

## Summary: Complete Request Lifecycle

### Example: Admin Viewing Students

1. **User Action**: Clicks "Students" in navigation
2. **Frontend**: `router.get('/admin/students')`
3. **Backend Route**: `GET /admin/students` matches `admin.students.index`
4. **Middleware**:
    - `auth` → Check authentication ✓
    - `role:admin` → Check role ✓
5. **Controller**: `Admin\StudentController@index`
    - Query: `Student::with(['club', 'organization'])->paginate(15)`
    - Return: `Inertia::render('Admin/Students/Index', ['students' => $students])`
6. **Inertia Middleware**: Adds shared props (auth, flash)
7. **Response**: JSON with component name and props
8. **Frontend**: React renders `Admin/Students/Index` component with students data
9. **UI**: Table displays student list with pagination

---

## Key Design Decisions

1. **Multiple Guards**: Allows users to potentially login to multiple roles (though UI currently supports single role login)
2. **Polymorphic Relations**: Single User table for all roles, with role-specific data in separate tables
3. **Inertia.js**: Server-side routing with SPA-like experience, no API layer needed
4. **Role-Based Routes**: Separate route groups per role for clear separation of concerns
5. **Service Layer**: `AuthService` centralizes authentication logic for consistency

---

## Potential Improvements / Observations

1. **Multi-Login Support**: Documentation mentions multi-login, but current implementation clears previous authentication
2. **API Layer**: If mobile app needed, would require separate API routes
3. **Caching**: No visible caching layer for frequently accessed data
4. **Queue Jobs**: Could be used for heavy operations (exports, reports)
5. **Event System**: Could use Laravel events for audit logging
