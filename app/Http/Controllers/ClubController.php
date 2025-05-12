<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use App\Models\Organization;
class ClubController extends Controller
{
    public function index(Request $request)
    {
        $clubs = Club::when($request->organization_id, function ($query) use ($request) {
            $query->where('organization_id', $request->organization_id);
        })->get();

        return Inertia::render('Clubs/Index', [
            'clubs' => $clubs,
            'organizationId' => $request->organization_id,
        ]);
    }


    public function create()
    {
        $companies = Company::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();

        return Inertia::render('Clubs/Create', [
            'companies' => $companies,
            'organizations' => $organizations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|integer',
            'organization_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'tax_number' => 'nullable|string|max:100',
            'invoice_prefix' => 'required|string|max:100',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'boolean',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'skype' => 'nullable|string|max:100',
            'notification_emails' => 'nullable|string|max:255',
            'website' => 'nullable|url',
            'postal_code' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('clubs/logos', 'public');
        }

        Club::create($validated);

        return redirect()->route('clubs.index')->with('success', 'Club created successfully.');
    }

    public function edit($id)
    {
        $club = Club::find($id);
        $companies = Company::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();

        return Inertia::render('Clubs/Edit', [
            'club' => $club,
            'companies' => $companies,
            'organizations' => $organizations,
        ]);
    }

    public function update(Request $request, Club $club)
    {
        $validated = $request->validate([
            'company_id' => 'required|integer',
            'organization_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'tax_number' => 'nullable|string|max:100',
            'invoice_prefix' => 'required|string|max:100',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'boolean',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'skype' => 'nullable|string|max:100',
            'notification_emails' => 'nullable|string|max:255',
            'website' => 'nullable|url',
            'postal_code' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('clubs/logos', 'public');
        }

        $club->update($validated);

        return redirect()->route('clubs.index')->with('success', 'Club updated successfully.');
    }

    public function destroy(Club $club)
    {
        $club->delete();

        return redirect()->route('clubs.index')->with('success', 'Club deleted successfully.');
    }
}
