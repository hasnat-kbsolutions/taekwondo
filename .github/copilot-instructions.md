# Copilot Instructions for AI Coding Agents

## Project Overview

This is a Laravel 11 monolith using InertiaJS and shadcn/ui for a modern user/admin panel. The backend is PHP (Laravel), the frontend uses InertiaJS (bridging Laravel and a JS SPA), and shadcn/ui for UI components. Data models include students, clubs, organizations, instructors, locations, and attendance.

## Key Architecture & Patterns

-   **Backend:**
    -   All business logic and data access are in `app/` (Controllers, Models, Exports/Imports, Requests, Middleware).
    -   Models are in `app/Models/` and map directly to database tables (see `database/migrations/`).
    -   Controllers in `app/Http/Controllers/` handle HTTP requests and orchestrate model/service logic.
    -   Exports/Imports in `app/Exports/` and `app/Imports/` for data transfer (e.g., Excel).
-   **Frontend:**
    -   Views are in `resources/views/` (Blade templates, often with InertiaJS entrypoints).
    -   Frontend assets (JS/CSS) in `resources/js/` and `resources/css/`.
    -   UI components use shadcn/ui conventions.
-   **Routing:**
    -   Web routes: `routes/web.php` (main app), `routes/auth.php` (auth), `routes/console.php` (CLI commands).
-   **Database:**
    -   Migrations in `database/migrations/` define schema.
    -   Seeders/factories in `database/seeders/` and `database/factories/` for test/demo data.

## Developer Workflows

-   **Install dependencies:**
    -   PHP: `composer install`
    -   JS: `npm install`
-   **Build frontend:**
    -   Dev: `npm run dev`
    -   Prod: `npm run build`
-   **Run server:** `php artisan serve`
-   **Migrate DB:** `php artisan migrate`
-   **Seed DB:** `php artisan db:seed`
-   **Run tests:** `php artisan test`

## Project-Specific Conventions

-   **Model naming:** Singular, PascalCase (e.g., `Student`, `Club`).
-   **Controllers:** Named for resource, plural, PascalCase (e.g., `StudentsController`).
-   **Exports/Imports:** Use Maatwebsite Excel package conventions.
-   **Frontend:** Use InertiaJS for SPA-like navigation; avoid direct Blade rendering for main app pages.
-   **Assets:** Use Vite for asset bundling (`vite.config.js`).

## Integration Points

-   **shadcn/ui:** For UI components, see [shadcn/ui docs](https://ui.shadcn.com/docs).
-   **InertiaJS:** For SPA routing and state, see [InertiaJS docs](https://inertiajs.com/).
-   **Maatwebsite/Excel:** For Exports/Imports, see `app/Exports/` and `app/Imports/`.

## Examples

-   Add a new model: create in `app/Models/`, migration in `database/migrations/`, controller in `app/Http/Controllers/`, and update routes in `routes/web.php`.
-   Add a frontend page: create a Vue/React component in `resources/js/Pages/`, add route in `routes/web.php`, and link via InertiaJS.

## References

-   `README.md` for setup and contact info
-   `app/`, `resources/`, `routes/`, `database/` for main code structure

---

For any unclear conventions or missing documentation, check `README.md` or ask for clarification.
