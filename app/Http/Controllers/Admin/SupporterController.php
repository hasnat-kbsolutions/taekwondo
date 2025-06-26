<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Supporter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\Club;
class SupporterController extends Controller
{
    public function index(Request $request)
    {
        $supporters = Supporter::when($request->organization_id, function ($query) use ($request) {
            $query->where('organization_id', $request->organization_id);
        })->get();

        return Inertia::render('Admin/Supporters/Index', [
            'supporters' => $supporters,
            'organizationId' => $request->organization_id,
        ]);
    }


    public function create()
    {

        $branches = Branch::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();
        $clubs = Club::select('id', 'name')->get();

        return Inertia::render('Admin/Supporters/Create', [
            'branches' => $branches,
            'organizations' => $organizations,
            'clubs' => $clubs,
        ]);
    }

    public function store(Request $request)
    {
        // $request->validate([
        //     'branch_id' => 'required|integer',
        //     'organization_id' => 'required|integer',
        //     'club_id' => 'required|integer',
        //     'name' => 'required|string|max:255',
        //     'surename' => 'required|string|max:255',
        //     'gender' => 'required|string|max:10',
        //     'email' => 'nullable|email|max:255',
        //     'phone' => 'nullable|string|max:20',
        //     'country' => 'nullable|string|max:100',
        //     'type' => 'required|string|max:50',
        //     'status' => 'nullable',
        //     'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        // ]);

        $data = $request->except('profile_image');
        $data['status'] = $request->boolean('status');

        if ($request->hasFile('profile_image')) {
            $data['profile_image'] = $request->file('profile_image')->store('supporters', 'public');
        }

        try {
            Supporter::create($data);
        } catch (\Exception $e) {
            \Log::error('Supporter creation failed: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Something went wrong.']);
        }


        return redirect()->route('admin.supporters.index')->with('success', 'Supporter created successfully');
    }

    public function edit(Supporter $supporter)
    {

        $branches = Branch::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();
        $clubs = Club::select('id', 'name')->get();

        return Inertia::render('Admin/Supporters/Edit', [
            'supporter' => $supporter,
            'branches' => $branches,
            'organizations' => $organizations,
            'clubs' => $clubs,
        ]);
    }

    public function update(Request $request, Supporter $supporter)
    {
        // $request->validate([
        //     'branch_id' => 'required|integer',
        //     'organization_id' => 'required|integer',
        //     'club_id' => 'required|integer',
        //     'name' => 'required|string|max:255',
        //     'surename' => 'required|string|max:255',
        //     'gender' => 'required|string|max:10',
        //     'email' => 'nullable|email|max:255',
        //     'phone' => 'nullable|string|max:20',
        //     'country' => 'nullable|string|max:100',
        //     'type' => 'required|string|max:50',
        //     'status' => 'boolean',
        //     'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        // ]);

        $data = $request->except('profile_image');

        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($supporter->profile_image) {
                Storage::disk('public')->delete($supporter->profile_image);
            }

            $data['profile_image'] = $request->file('profile_image')->store('supporters', 'public');
        }

        $supporter->update($data);

        return redirect()->route('admin.supporters.index')->with('success', 'Supporter updated successfully');
    }

    public function destroy(Supporter $supporter)
    {
        if ($supporter->profile_image) {
            Storage::disk('public')->delete($supporter->profile_image);
        }

        $supporter->delete();

        return redirect()->route('admin.supporters.index')->with('success', 'Supporter deleted successfully');
    }
}
