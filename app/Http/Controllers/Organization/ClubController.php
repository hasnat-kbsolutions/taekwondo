<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ClubController extends Controller
{
    public function index(Request $request)
    {
        $query = Club::with(['organization', 'user', 'students'])
            ->where('organization_id', Auth::user()->userable_id);

        if ($request->filled('country')) {
            $query->where('country', $request->country);
        }

        return Inertia::render('Organization/Clubs/Index', [
            'clubs' => $query->latest()->get(),
            'filters' => [
                'country' => $request->country,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Organization/Clubs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([

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
            'logo' => 'nullable|image|max:2048',
        ]);
        if ($request->hasFile('logo')) {
            $relativePath = $request->file('logo')->store('clubs', 'public');
            $validated['logo'] = asset('storage/' . $relativePath); // full URL path
        }




        $club = Club::create([
            'organization_id' => Auth::user()->userable_id,
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

        return redirect()->route('organization.clubs.index')->with('success', 'Club created successfully.');

    }

    public function edit($id)
    {
        $club = Club::with('user')->findOrFail($id);
        return Inertia::render('Organization/Clubs/Edit', [
            'club' => $club,
        ]);
    }

    public function update(Request $request, Club $club)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . optional($club->user)->id,

            // password is optional, but must meet rules if filled
            'password' => 'nullable|string|min:8|confirmed',

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



        return redirect()->route('organization.clubs.index')->with('success', 'Club updated successfully');

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

        return redirect()->route('organization.clubs.index')->with('success', 'Club deleted successfully');
    }

    public function updatePassword(Request $request, Club $club)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Update the user's password if the club has a linked user
        if ($club->user) {
            $club->user->update([
                'password' => Hash::make($validated['password']),
            ]);

            return redirect()->route('organization.clubs.index')->with('success', 'Password updated successfully');
        }

        return redirect()->route('organization.clubs.index')->with('error', 'No user account found for this club');
    }
}
