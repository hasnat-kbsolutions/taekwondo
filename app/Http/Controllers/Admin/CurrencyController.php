<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    public function index()
    {
        $currencies = Currency::orderBy('code')->get();

        return Inertia::render('Admin/Currencies/Index', [
            'currencies' => $currencies,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Currencies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|size:3|unique:currencies,code',
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10',
            'decimal_places' => 'required|integer|min:0|max:4',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ]);

        // If setting this as default, unset other defaults
        if ($validated['is_default']) {
            Currency::where('is_default', true)->update(['is_default' => false]);
        }

        Currency::create($validated);

        return redirect()->route('admin.currencies.index')
            ->with('success', 'Currency created successfully.');
    }

    public function edit(Currency $currency)
    {
        return Inertia::render('Admin/Currencies/Edit', [
            'currency' => $currency,
        ]);
    }

    public function update(Request $request, Currency $currency)
    {
        $validated = $request->validate([
            'code' => 'required|string|size:3|unique:currencies,code,' . $currency->id,
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10',
            'decimal_places' => 'required|integer|min:0|max:4',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ]);

        // If setting this as default, unset other defaults
        if ($validated['is_default']) {
            Currency::where('is_default', true)->update(['is_default' => false]);
        }

        $currency->update($validated);

        return redirect()->route('admin.currencies.index')
            ->with('success', 'Currency updated successfully.');
    }

    public function destroy(Currency $currency)
    {
        // Prevent deletion of default currency
        if ($currency->is_default) {
            return redirect()->route('admin.currencies.index')
                ->with('error', 'Cannot delete the default currency.');
        }

        // Check if currency is in use
        if ($currency->payments()->exists() || $currency->organizations()->exists() || $currency->clubs()->exists()) {
            return redirect()->route('admin.currencies.index')
                ->with('error', 'Cannot delete currency that is in use.');
        }

        $currency->delete();

        return redirect()->route('admin.currencies.index')
            ->with('success', 'Currency deleted successfully.');
    }

    public function toggleActive(Currency $currency)
    {
        // Prevent deactivating default currency
        if ($currency->is_default) {
            return redirect()->route('admin.currencies.index')
                ->with('error', 'Cannot deactivate the default currency.');
        }

        $currency->update(['is_active' => !$currency->is_active]);

        $status = $currency->is_active ? 'activated' : 'deactivated';
        return redirect()->route('admin.currencies.index')
            ->with('success', "Currency {$status} successfully.");
    }

    public function setDefault(Currency $currency)
    {
        // Unset current default
        Currency::where('is_default', true)->update(['is_default' => false]);

        // Set new default
        $currency->update(['is_default' => true]);

        return redirect()->route('admin.currencies.index')
            ->with('success', "{$currency->name} set as default currency.");
    }
}
