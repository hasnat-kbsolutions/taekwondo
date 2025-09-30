<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\BankInformation;
use App\Models\User;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BankInformationController extends Controller
{
    public function index(Request $request)
    {
        // Get the authenticated organization user
        $organization = Auth::user();

        if (!$organization || $organization->role !== 'organization') {
            return back()->withErrors(['error' => 'Organization user not found.']);
        }

        $query = BankInformation::with(['userable'])
            ->where('userable_type', User::class)
            ->where('userable_id', $organization->id);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('bank_name', 'like', "%{$search}%")
                    ->orWhere('account_name', 'like', "%{$search}%")
                    ->orWhere('account_number', 'like', "%{$search}%");
            });
        }

        $bankInformations = $query->latest()->get();

        return Inertia::render('Organization/BankInformation/Index', [
            'bankInformations' => $bankInformations,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $currencies = Currency::where('is_active', true)->get();

        return Inertia::render('Organization/BankInformation/Create', [
            'currencies' => $currencies,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'iban' => 'nullable|string|max:255',
            'swift_code' => 'nullable|string|max:255',
            'branch' => 'nullable|string|max:255',
            'currency' => 'required|string|size:3|exists:currencies,code',
        ]);

        // Get the authenticated organization user
        $organization = Auth::user();

        if (!$organization || $organization->role !== 'organization') {
            return back()->withErrors(['error' => 'Organization user not found.']);
        }

        // Add the organization as the owner
        $validated['userable_type'] = User::class;
        $validated['userable_id'] = $organization->id;

        BankInformation::create($validated);

        return redirect()->route('organization.bank-information.index')->with('success', 'Bank information created successfully.');
    }

    public function edit(BankInformation $bankInformation)
    {
        $bankInformation->load('userable');

        $currencies = Currency::where('is_active', true)->get();

        return Inertia::render('Organization/BankInformation/Edit', [
            'bankInformation' => $bankInformation,
            'currencies' => $currencies,
        ]);
    }

    public function update(Request $request, BankInformation $bankInformation)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'iban' => 'nullable|string|max:255',
            'swift_code' => 'nullable|string|max:255',
            'branch' => 'nullable|string|max:255',
            'currency' => 'required|string|size:3|exists:currencies,code',
        ]);

        // Get the authenticated organization user
        $organization = Auth::user();

        if (!$organization || $organization->role !== 'organization') {
            return back()->withErrors(['error' => 'Organization user not found.']);
        }

        // Ensure the bank information belongs to the current organization
        if ($bankInformation->userable_type !== User::class || $bankInformation->userable_id !== $organization->id) {
            return back()->withErrors(['error' => 'You can only edit your own bank information.']);
        }

        $bankInformation->update($validated);

        return redirect()->route('organization.bank-information.index')->with('success', 'Bank information updated successfully.');
    }

    public function destroy(BankInformation $bankInformation)
    {
        // Get the authenticated organization user
        $organization = Auth::user();

        if (!$organization || $organization->role !== 'organization') {
            return back()->withErrors(['error' => 'Organization user not found.']);
        }

        // Ensure the bank information belongs to the current organization
        if ($bankInformation->userable_type !== User::class || $bankInformation->userable_id !== $organization->id) {
            return back()->withErrors(['error' => 'You can only delete your own bank information.']);
        }

        $bankInformation->delete();

        return redirect()->route('organization.bank-information.index')->with('success', 'Bank information deleted successfully.');
    }
}
