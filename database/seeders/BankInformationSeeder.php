<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BankInformation;
use App\Models\User;

class BankInformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first admin user
        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            $this->command->error('No admin user found. Please create an admin user first.');
            return;
        }

        // Create sample bank information for the admin
        BankInformation::create([
            'bank_name' => 'Maybank',
            'account_name' => 'Taekwondo Academy',
            'account_number' => '1234567890',
            'iban' => 'MY12345678901234567890',
            'swift_code' => 'MBBEMYKL',
            'branch' => 'Kuala Lumpur Main Branch',
            'currency' => 'MYR',
            'userable_type' => User::class,
            'userable_id' => $admin->id,
        ]);

        BankInformation::create([
            'bank_name' => 'CIMB Bank',
            'account_name' => 'Taekwondo Academy',
            'account_number' => '0987654321',
            'iban' => 'MY09876543210987654321',
            'swift_code' => 'CIBBMYKL',
            'branch' => 'Petaling Jaya Branch',
            'currency' => 'MYR',
            'userable_type' => User::class,
            'userable_id' => $admin->id,
        ]);

        BankInformation::create([
            'bank_name' => 'HSBC Bank',
            'account_name' => 'Taekwondo Academy',
            'account_number' => '1122334455',
            'iban' => 'MY11223344551122334455',
            'swift_code' => 'HBSCMYKL',
            'branch' => 'Kuala Lumpur Branch',
            'currency' => 'USD',
            'userable_type' => User::class,
            'userable_id' => $admin->id,
        ]);

        $this->command->info('Bank information created successfully for admin: ' . $admin->name);
    }
}