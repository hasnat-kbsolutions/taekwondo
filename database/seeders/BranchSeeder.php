<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 1) as $i) {
            $branch = Branch::create([
                'name' => $faker->name,
                'organization_id' => 1,
                'country' => $faker->country,
                'city' => $faker->city,
                'street' => $faker->streetAddress,
                'postal_code' => $faker->postcode,
                'logo_image' => null,
                'status' => $faker->boolean(90),
            ]);
            $branch->user()->create([
                'name' => 'Branch User',
                'email' => 'branch@app.test',
                'password' => Hash::make('password'),
                'role' => 'branch',
                'userable_type' => Branch::class,
                'userable_id' => $branch->id,
            ]);
        }
    }
}
