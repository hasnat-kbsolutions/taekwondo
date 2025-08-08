<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = [
            [
                'name' => 'Malaysian Taekwon-Do Federation',
                'code' => 'ORG001',
                'email' => 'info@mtf.org.my',
                'phone' => '+603-1234-5678',
                'street' => '123 Jalan Ampang',
                'city' => 'Kuala Lumpur',
                'postal_code' => '50450',
                'country' => 'Malaysia',
                'website' => 'https://www.mtf.org.my',
                'status' => true,
            ],
            [
                'name' => 'Selangor Taekwon-Do Association',
                'code' => 'ORG002',
                'email' => 'info@selangortkd.org.my',
                'phone' => '+603-9876-5432',
                'street' => '456 Jalan Sultan',
                'city' => 'Shah Alam',
                'postal_code' => '40000',
                'country' => 'Malaysia',
                'website' => 'https://www.selangortkd.org.my',
                'status' => true,
            ],
            [
                'name' => 'Penang Taekwon-Do Federation',
                'code' => 'ORG003',
                'email' => 'info@penangtkd.org.my',
                'phone' => '+604-1111-2222',
                'street' => '789 Jalan Penang',
                'city' => 'George Town',
                'postal_code' => '10000',
                'country' => 'Malaysia',
                'website' => 'https://www.penangtkd.org.my',
                'status' => true,
            ],
        ];

        foreach ($organizations as $organization) {
            Organization::create($organization);
        }
    }
}
