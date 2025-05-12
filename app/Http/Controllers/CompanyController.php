<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::all();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
        ]);
    }

    public function create()
    {
        return Inertia::render('Companies/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'logo_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'boolean',
        ]);

        $data = $request->except('logo_image');

        if ($request->hasFile('logo_image')) {
            $data['logo_image'] = $request->file('logo_image')->store('companies', 'public');
        }

        Company::create($data);

        return redirect()->route('companies.index')->with('success', 'Company created successfully');
    }

    public function edit(Company $company)
    {
        return Inertia::render('Companies/Edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'logo_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'boolean',
        ]);

        $data = $request->except('logo_image');

        if ($request->hasFile('logo_image')) {
            if ($company->logo_image) {
                Storage::disk('public')->delete($company->logo_image);
            }
            $data['logo_image'] = $request->file('logo_image')->store('companies', 'public');
        }

        $company->update($data);

        return redirect()->route('companies.index')->with('success', 'Company updated successfully');
    }

    public function destroy(Company $company)
    {
        if ($company->logo_image) {
            Storage::disk('public')->delete($company->logo_image);
        }

        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully');
    }
}
