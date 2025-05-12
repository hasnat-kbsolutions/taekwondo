<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use Faker\Factory as Faker;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 5) as $i) {
            Company::create([
                'name' => $faker->company,
                'country' => $faker->country,
                'city' => $faker->city,
                'street' => $faker->streetAddress,
                'postal_code' => $faker->postcode,
                'logo_image' => null,
                'status' => $faker->boolean(90),
            ]);
        }
    }
}
