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

        foreach (range(1, 5) as $i) {
            Organization::create([
                'name' => $faker->company . ' Org',
                'status' => $faker->boolean(90),
            ]);
        }
    }
}
