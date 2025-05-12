<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;
use App\Models\Company;
use App\Models\Organization;
use Faker\Factory as Faker;

class ClubSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $companyIds = Company::pluck('id')->toArray();
        $organizationIds = Organization::pluck('id')->toArray();

        foreach (range(1, 10) as $i) {
            Club::create([
                'company_id' => $faker->randomElement($companyIds),
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
