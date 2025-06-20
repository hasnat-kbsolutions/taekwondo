<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\Club;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $branchIds = Branch::pluck('id')->toArray();
        $organizationIds = Organization::pluck('id')->toArray();
        $clubIds = Club::pluck('id')->toArray();

        foreach (range(1, 5) as $index) {
            Student::create([
                'branch_id' => $faker->randomElement($branchIds),
                'organization_id' => $faker->randomElement($organizationIds),
                'club_id' => $faker->randomElement($clubIds),
                'uid' => Str::uuid(),
                'code' => strtoupper(Str::random(6)),
                'name' => $faker->firstName,
                'surname' => $faker->lastName,
                'nationality' => $faker->country,
                'dob' => $faker->date(),
                'dod' => rand(0, 10) > 8 ? $faker->date() : null,
                'grade' => $faker->randomElement(['A', 'B', 'C', 'D']),
                'gender' => $faker->randomElement(['male', 'female', 'other']),
                'id_passport' => $faker->boolean(50) ? strtoupper(Str::random(9)) : null,
                'profile_image' => null,
                'id_passport_image' => null,
                'signature_image' => null,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'skype' => $faker->userName,
                'website' => $faker->url,
                'city' => $faker->city,
                'postal_code' => $faker->postcode,
                'street' => $faker->streetAddress,
                'country' => $faker->country,
                'status' => $faker->boolean(80),
            ]);
        }
    }
}
