<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Club;
use App\Models\Organization;

use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $clubIds = Club::pluck('id')->toArray();
        $organizationIds = Organization::pluck('id')->toArray();

        foreach (range(1, end: 1) as $index) {
            $student = Student::create([
                'club_id' => $faker->randomElement($clubIds),
                'organization_id' => $faker->randomElement($organizationIds),
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
            $student->user()->create([
                'name' => 'Student User',
                'email' => 'student@app.test',
                'password' => Hash::make('password'),
                'role' => 'student',
                'userable_type' => Student::class,
                'userable_id' => $student->id,
            ]);
        }
    }
}
