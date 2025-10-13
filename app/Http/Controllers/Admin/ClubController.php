<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Organization;
use App\Models\Currency;
use App\Models\User;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClubController extends Controller
{
    public function index(Request $request)
    {
        $organizations = Organization::all();

        $query = Club::with([
            'organization',
            'user',
            'students',
            'instructors',
            'supporters'
        ]);

        if ($request->filled('organization_id')) {
            $query->where('organization_id', $request->organization_id);
        }

        if ($request->filled('country')) {
            $query->where('country', $request->country);
        }

        $clubs = $query->latest()->get();

        // Add statistics for each club
        $clubs->each(function ($club) {
            // Get student IDs for this club
            $studentIds = $club->students->pluck('id');

            // Payment statistics with currency breakdown
            $payments = \App\Models\Payment::whereIn('student_id', $studentIds)->with('currency');
            $totalPayments = $payments->count();

            // Calculate amounts by currency
            $amountsByCurrency = $payments->get()->groupBy('currency_code')
                ->map(function ($currencyPayments) {
                    return (float) $currencyPayments->sum('amount');
                });

            $defaultCurrencyCode = $club->default_currency ?? 'MYR';
            $totalAmount = $amountsByCurrency[$defaultCurrencyCode] ?? 0;

            $club->payment_stats = [
                'total_payments' => $totalPayments,
                'paid_count' => $payments->where('status', 'paid')->count(),
                'pending_count' => $payments->where('status', 'pending')->count(),
                'total_amount' => $totalAmount,
                'average_amount' => $totalPayments > 0 ? round($totalAmount / $totalPayments, 2) : 0,
                'amounts_by_currency' => $amountsByCurrency,
                'default_currency_code' => $defaultCurrencyCode,
            ];

            // Attendance statistics
            $attendances = \App\Models\Attendance::whereIn('student_id', $studentIds);
            $totalAttendances = $attendances->count();
            $presentCount = $attendances->where('status', 'present')->count();

            $club->attendance_stats = [
                'total_attendances' => $totalAttendances,
                'present_count' => $presentCount,
                'absent_count' => $attendances->where('status', 'absent')->count(),
                'late_count' => $attendances->where('status', 'late')->count(),
                'attendance_rate' => $totalAttendances > 0 ? round(($presentCount / $totalAttendances) * 100, 1) : 0,
            ];

            // Certification statistics
            $certifications = \App\Models\Certification::whereIn('student_id', $studentIds);
            $totalCertifications = $certifications->count();
            $completedCount = $certifications->whereNotNull('issued_at')->count();

            $club->certification_stats = [
                'total_certifications' => $totalCertifications,
                'completed_count' => $completedCount,
                'pending_count' => $certifications->whereNull('issued_at')->count(),
                'completion_rate' => $totalCertifications > 0 ? round(($completedCount / $totalCertifications) * 100, 1) : 0,
            ];

            // Club performance metrics
            $club->performance_metrics = [
                'total_members' => $club->students->count() + $club->instructors->count() + $club->supporters->count(),
                'student_to_instructor_ratio' => $club->instructors->count() > 0 ? round($club->students->count() / $club->instructors->count(), 1) : 0,
                'monthly_revenue' => $totalAmount, // This could be enhanced to show monthly breakdown
            ];
        });

        return Inertia::render('Admin/Clubs/Index', [
            'clubs' => $clubs,
            'organizations' => $organizations,
            'filters' => $request->only('organization_id', 'country'),
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/Clubs/Create', [
            'organizations' => Organization::select('id', 'name')->get(),
            'currencies' => Currency::where('is_active', true)->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',

            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'notification_emails' => 'nullable|boolean',
            'website' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:255',
            'invoice_prefix' => 'nullable|string|max:255',
            'status' => 'boolean',
            'default_currency' => 'required|string|exists:currencies,code',
            'logo' => 'nullable|image|max:2048',
        ]);
        if ($request->hasFile('logo')) {
            $relativePath = $request->file('logo')->store('clubs', 'public');
            $validated['logo'] = asset('storage/' . $relativePath); // full URL path
        }




        $club = Club::create([
            'organization_id' => $validated['organization_id'],
            'name' => $validated['name'],
            'country' => $validated['country'] ?? null,
            'city' => $validated['city'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'notification_emails' => $validated['notification_emails'] ?? false,
            'website' => $validated['website'] ?? null,
            'tax_number' => $validated['tax_number'] ?? null,
            'invoice_prefix' => $validated['invoice_prefix'] ?? null,
            'status' => $validated['status'] ?? false,
            'default_currency' => $validated['default_currency'],
            'logo' => $validated['logo'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'club',
            'userable_type' => Club::class,
            'userable_id' => $club->id,
        ]);

        return redirect()->route('admin.clubs.index')->with('success', 'Club created successfully.');

    }

    public function edit($id)
    {
        $club = Club::with('user')->findOrFail($id);
        return Inertia::render('Admin/Clubs/Edit', [
            'club' => $club,
            'organizations' => Organization::select('id', 'name')->get(),
            'currencies' => Currency::where('is_active', true)->get()
        ]);
    }

    public function update(Request $request, Club $club)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . optional($club->user)->id,

            // password is optional, but must meet rules if filled
            'password' => 'nullable|string|min:8|confirmed',

            'organization_id' => 'required|exists:organizations,id',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'notification_emails' => 'nullable|boolean',
            'website' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:255',
            'invoice_prefix' => 'nullable|string|max:255',
            'status' => 'boolean',
            'default_currency' => 'required|string|exists:currencies,code',
            'logo' => 'nullable|image|max:2048',
        ]);


        if ($request->hasFile('logo')) {
            if ($club->logo) {
                // Extract and delete the existing file from the storage path
                $path = str_replace('/storage/', '', parse_url($club->logo, PHP_URL_PATH));
                Storage::disk('public')->delete($path);
            }

            // Upload new logo and store full URL
            $relativePath = $request->file('logo')->store('clubs', 'public');
            $validated['logo'] = asset('storage/' . $relativePath);
        }

        $updateData = [
            'organization_id' => $validated['organization_id'],
            'name' => $validated['name'],
            'country' => $validated['country'] ?? null,
            'city' => $validated['city'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'notification_emails' => $validated['notification_emails'] ?? false,
            'website' => $validated['website'] ?? null,
            'tax_number' => $validated['tax_number'] ?? null,
            'invoice_prefix' => $validated['invoice_prefix'] ?? null,
            'status' => $validated['status'] ?? false,
            'default_currency' => $validated['default_currency'],
        ];

        // ✅ Only include logo if uploaded
        if (isset($validated['logo'])) {
            $updateData['logo'] = $validated['logo'];
        }

        $club->update($updateData);

        if ($club->user) {
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $club->user->update($updateData);
        }

        return redirect()->route('admin.clubs.index')->with('success', 'Club updated successfully');

    }

    public function destroy(Club $club)
    {
        if ($club->user) {
            $club->user->delete();
        }

        if ($club->logo) {
            Storage::disk('public')->delete($club->logo);
        }

        $club->delete();

        return redirect()->route('admin.clubs.index')->with('success', 'Club deleted successfully');
    }
}
