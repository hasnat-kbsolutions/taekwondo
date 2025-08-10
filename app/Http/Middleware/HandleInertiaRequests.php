<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';
    protected $flash = ['success', 'error'];


    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                // This ensures withErrors(['error' => '…']) also works
                'error' => fn() =>
                    $request->session()->get('error') ??
                    $request->session()->get('errors')?->get('error'),
                'import_log' => fn() => $request->session()->get('import_log'),
            ],
            'auth' => [
                'user' => $request->user(),
            ],
        ];
    }


}
