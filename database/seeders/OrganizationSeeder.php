<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 1) as $i) {
            $organization = Organization::create([
                'name' => $faker->name . ' Org',
                'status' => $faker->boolean(90),
            ]);
            $organization->user()->create([
                'name' => 'Organization User',
                'email' => 'organization@app.test',
                'password' => Hash::make('password'),
                'role' => 'organization',
                'userable_type' => Organization::class,
                'userable_id' => $organization->id,
            ]);
        }
    }
}
