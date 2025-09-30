<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BankInformation;
use App\Models\Organization;
use App\Models\Club;
use App\Models\User;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BankInformationController extends Controller
{
    public function index(Request $request)
    {
        $query = BankInformation::with(['userable']);

        // Filter by userable type if specified
        if ($request->filled('userable_type')) {
            $query->where('userable_type', $request->userable_type);
        }

        // Filter by userable ID if specified
        if ($request->filled('userable_id')) {
            $query->where('userable_id', $request->userable_id);
        }

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

        // Get all organizations and clubs for filtering
        $organizations = Organization::select('id', 'name')->get();
        $clubs = Club::select('id', 'name')->get();
        $admins = User::where('role', 'admin')->select('id', 'name')->get();

        return Inertia::render('Admin/BankInformation/Index', [
            'bankInformations' => $bankInformations,
            'organizations' => $organizations,
            'clubs' => $clubs,
            'admins' => $admins,
            'filters' => $request->only('userable_type', 'userable_id', 'search'),
        ]);
    }

    public function create()
    {
        $currencies = Currency::where('is_active', true)->get();

        return Inertia::render('Admin/BankInformation/Create', [
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

        // Get the authenticated admin user
        $admin = Auth::user();

        if (!$admin || $admin->role !== 'admin') {
            return back()->withErrors(['error' => 'Admin user not found.']);
        }

        // Add the admin as the owner
        $validated['userable_type'] = User::class;
        $validated['userable_id'] = $admin->id;

        BankInformation::create($validated);

        return redirect()->route('admin.bank-information.index')->with('success', 'Bank information created successfully.');
    }

    public function edit(BankInformation $bankInformation)
    {
        $bankInformation->load('userable');

        $currencies = Currency::where('is_active', true)->get();

        return Inertia::render('Admin/BankInformation/Edit', [
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

        // Get the authenticated admin user
        $admin = Auth::user();

        if (!$admin || $admin->role !== 'admin') {
            return back()->withErrors(['error' => 'Admin user not found.']);
        }

        // Ensure the bank information belongs to the current admin
        if ($bankInformation->userable_type !== User::class || $bankInformation->userable_id !== $admin->id) {
            return back()->withErrors(['error' => 'You can only edit your own bank information.']);
        }

        $bankInformation->update($validated);

        return redirect()->route('admin.bank-information.index')->with('success', 'Bank information updated successfully.');
    }

    public function destroy(BankInformation $bankInformation)
    {
        // Get the authenticated admin user
        $admin = Auth::user();

        if (!$admin || $admin->role !== 'admin') {
            return back()->withErrors(['error' => 'Admin user not found.']);
        }

        // Ensure the bank information belongs to the current admin
        if ($bankInformation->userable_type !== User::class || $bankInformation->userable_id !== $admin->id) {
            return back()->withErrors(['error' => 'You can only delete your own bank information.']);
        }

        $bankInformation->delete();

        return redirect()->route('admin.bank-information.index')->with('success', 'Bank information deleted successfully.');
    }
}
