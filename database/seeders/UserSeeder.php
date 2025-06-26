<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin (no profile)
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@app.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }
}
