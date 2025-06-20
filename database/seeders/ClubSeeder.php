<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;
use App\Models\Branch;
use App\Models\Organization;
use Faker\Factory as Faker;

class ClubSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $branchIds = Branch::pluck('id')->toArray();
        $organizationIds = Organization::pluck('id')->toArray();

        foreach (range(1, 2) as $i) {
            Club::create([
                'branch_id' => $faker->randomElement($branchIds),
                'organization_id' => $faker->randomElement($organizationIds),
                'name' => $faker->word . ' Club',
                'tax_number' => $faker->boolean(50) ? $faker->numerify('#########') : null,
                'invoice_prefix' => strtoupper($faker->lexify('INV???')),
                'logo' => null,
                'status' => $faker->boolean(80),
                'email' => $faker->email,
                'phone' => $faker->phoneNumber,
                'skype' => $faker->userName,
                'notification_emails' => $faker->email,
                'website' => $faker->url,
                'postal_code' => $faker->postcode,
                'city' => $faker->city,
                'street' => $faker->streetAddress,
                'country' => $faker->country,
            ]);
        }
    }
}
