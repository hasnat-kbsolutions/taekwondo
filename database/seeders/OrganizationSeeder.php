<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use Faker\Factory as Faker;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 2) as $i) {
            Organization::create([
                'name' => $faker->name . ' Org',
                'status' => $faker->boolean(90),
            ]);
        }
    }
}
