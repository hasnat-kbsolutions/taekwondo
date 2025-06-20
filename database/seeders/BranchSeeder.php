<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;
use Faker\Factory as Faker;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 2) as $i) {
            Branch::create([
                'name' => $faker->name,
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
