<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'organization_id', 'club_id', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('role');


        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,organization,club,student,guardian',
            'organization_id' => 'nullable|exists:organizations,id',
            'club_id' => 'nullable|exists:clubs,id',
            'password' => 'nullable|string|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password'] ?? 'password');

        User::create($validated);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,organization,club,student,guardian',
            'organization_id' => 'nullable|exists:organizations,id',
            'club_id' => 'nullable|exists:clubs,id',
            'password' => 'nullable|string|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']); // prevent overwriting with null
        }

        $user->update($validated);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully');
    }
}
