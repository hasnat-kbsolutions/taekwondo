<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClubController extends Controller
{
    public function index()
    {
        $clubs = Club::with(['organization', 'user'])->get();

        return Inertia::render('Admin/Clubs/Index', [
            'clubs' => $clubs,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Clubs/Create', [
            'organizations' => Organization::select('id', 'name')->get()
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
            'skype' => 'nullable|string|max:255',
            'notification_emails' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:255',
            'invoice_prefix' => 'nullable|string|max:255',
            'status' => 'boolean',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('clubs', 'public');
        }

        $club = Club::create([
            'organization_id' => $validated['organization_id'],
            'name' => $validated['name'],
            'country' => $validated['country'] ?? null,
            'city' => $validated['city'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'skype' => $validated['skype'] ?? null,
            'notification_emails' => $validated['notification_emails'] ?? null,
            'website' => $validated['website'] ?? null,
            'tax_number' => $validated['tax_number'] ?? null,
            'invoice_prefix' => $validated['invoice_prefix'] ?? null,
            'status' => $validated['status'] ?? false,
            'logo' => $validated['logo'] ?? null,
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'club',
            'userable_type' => Club::class,
            'userable_id' => $club->id,
        ]);

        return redirect()->route('admin.clubs.index')->with('success', 'Club created successfully');
    }

    public function edit( $id)
    {
        $club = Club::with('user')->findOrFail($id);
        return Inertia::render('Admin/Clubs/Edit', [
            'club' => $club,
            'organizations' => Organization::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Club $club)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . optional($club->user)->id,
            'password' => 'required|string|min:8|confirmed',

            'organization_id' => 'required|exists:organizations,id',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'skype' => 'nullable|string|max:255',
            'notification_emails' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:255',
            'invoice_prefix' => 'nullable|string|max:255',
            'status' => 'boolean',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($club->logo) {
                Storage::disk('public')->delete($club->logo);
            }
            $validated['logo'] = $request->file('logo')->store('clubs', 'public');
        }

        $club->update([
            'organization_id' => $validated['organization_id'],
            'name' => $validated['name'],
            'country' => $validated['country'] ?? null,
            'city' => $validated['city'] ?? null,
            'street' => $validated['street'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'skype' => $validated['skype'] ?? null,
            'notification_emails' => $validated['notification_emails'] ?? null,
            'website' => $validated['website'] ?? null,
            'tax_number' => $validated['tax_number'] ?? null,
            'invoice_prefix' => $validated['invoice_prefix'] ?? null,
            'status' => $validated['status'] ?? false,
            'logo' => $validated['logo'] ?? $club->logo,
        ]);

        if ($club->user) {
            $club->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $request->filled('password')
                    ? Hash::make($request->password)
                    : $club->user->password,
            ]);
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
