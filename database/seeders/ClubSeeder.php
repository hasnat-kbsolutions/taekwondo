<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class ClubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = Organization::all();

        $clubs = [
            [
                'name' => 'KL Taekwon-Do Center',
                'phone' => '+603-1234-1111',
                'street' => '123 Jalan Bukit Bintang',
                'city' => 'Kuala Lumpur',
                'postal_code' => '55100',
                'country' => 'Malaysia',
                'website' => 'https://www.kltkd.com',
                'status' => true,
            ],
            [
                'name' => 'Shah Alam Martial Arts Club',
                'phone' => '+603-9876-2222',
                'street' => '456 Jalan Subang',
                'city' => 'Shah Alam',
                'postal_code' => '40100',
                'country' => 'Malaysia',
                'website' => 'https://www.samartialarts.com',
                'status' => true,
            ],
            [
                'name' => 'Penang Combat Academy',
                'phone' => '+604-1111-3333',
                'street' => '789 Jalan Gurney',
                'city' => 'George Town',
                'postal_code' => '10250',
                'country' => 'Malaysia',
                'website' => 'https://www.penangcombat.com',
                'status' => true,
            ],
        ];

        foreach ($clubs as $index => $club) {
            $club['organization_id'] = $organizations[$index % $organizations->count()]->id;
            Club::create($club);
        }
    }
}