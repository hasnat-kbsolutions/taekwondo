<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;
class ClubSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 1) as $i) {
            $club = Club::create([
                'name' => $faker->company,
                'organization_id' => 1,
                'country' => $faker->country,
                'city' => $faker->city,
                'street' => $faker->streetAddress,
                'postal_code' => $faker->postcode,
                'tax_number' => $faker->numerify('TAX###'),
                'invoice_prefix' => strtoupper($faker->lexify('INV??')),
                'phone' => $faker->phoneNumber,
                'skype' => $faker->userName,
                'notification_emails' => $faker->safeEmail,
                'website' => $faker->url,
                'logo' => null,
                'status' => $faker->boolean(90),
            ]);

            $club->user()->create([
                'name' => 'Club User',
                'email' => 'club@app.test',
                'password' => Hash::make('password'),
                'role' => 'club',
                'userable_type' => Club::class,
                'userable_id' => $club->id,
            ]);
        }
    }
}