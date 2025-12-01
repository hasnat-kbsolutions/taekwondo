<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Club;
use App\Models\Student;
use App\Models\Plan;
use App\Models\StudentFeePlan;
use App\Models\Instructor;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Currency;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class ComprehensiveDummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting comprehensive dummy data seeding...');

        // Step 1: Create Organizations
        $this->command->info('Creating organizations...');
        $organizations = $this->createOrganizations();

        // Step 2: Create Clubs
        $this->command->info('Creating clubs...');
        $clubs = $this->createClubs($organizations);

        // Step 3: Create Organization and Club Users
        $this->command->info('Creating organization and club users...');
        $this->createOrganizationClubUsers($organizations, $clubs);

        // Step 4: Create Plans
        $this->command->info('Creating plans...');
        $this->createPlans($organizations, $clubs);

        // Step 5: Create Students (100+)
        $this->command->info('Creating 150+ students...');
        $students = $this->createStudents($organizations, $clubs);

        // Step 6: Create Student Fee Plans
        $this->command->info('Creating student fee plans...');
        $this->createStudentFeePlans($students);

        // Step 7: Create Instructors
        $this->command->info('Creating instructors...');
        $this->createInstructors($organizations, $clubs);

        // Step 8: Create Payments
        $this->command->info('Creating payments...');
        $this->createPayments($students);

        // Step 9: Create Attendances
        $this->command->info('Creating attendances...');
        $this->createAttendances($students);

        $this->command->info('Dummy data seeding completed!');
    }

    private function createOrganizations()
    {
        $names = [
            'Malaysian Taekwon-Do Federation',
            'Selangor Taekwon-Do Association',
            'Penang Taekwon-Do Federation',
            'Johor Taekwon-Do Council',
            'Sabah Taekwon-Do Sports Club',
        ];

        $cities = ['Kuala Lumpur', 'Shah Alam', 'George Town', 'Johor Bahru', 'Kota Kinabalu'];
        $postcodes = ['50450', '40000', '10250', '80000', '88000'];

        $organizations = [];
        foreach ($names as $index => $name) {
            $org = Organization::updateOrCreate(
                ['email' => 'org' . ($index + 1) . '@taekwondo.my'],
                [
                    'name' => $name,
                    'phone' => '+603-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT) . '-5678',
                    'street' => ($index + 1) . '00 Jalan ' . $cities[$index],
                    'city' => $cities[$index],
                    'postal_code' => $postcodes[$index],
                    'country' => 'Malaysia',
                    'website' => 'https://org' . ($index + 1) . '.taekwondo.my',
                    'status' => true,
                    'default_currency' => 'MYR',
                ]
            );
            $organizations[] = $org;
        }

        return $organizations;
    }

    private function createClubs($organizations)
    {
        $clubNames = [
            'Elite Taekwon-Do',
            'Dragon Force Academy',
            'Victory Martial Arts',
            'Champions Training Center',
            'Phoenix Dojo',
            'Warrior Spirit Academy',
            'Black Belt Institute',
            'Taekwon-Do Excellence',
            'Masters Academy',
            'Future Champions Club',
            'Rising Stars Dojo',
            'Olympic Training Center',
            'Youth Development Academy',
            'Senior Masters Club',
            'Professional Fighters Academy',
        ];

        $clubs = [];
        $clubIndex = 0;

        foreach ($organizations as $org) {
            // Create 3 clubs per organization
            for ($i = 0; $i < 3; $i++) {
                $clubIndex++;
                $club = Club::updateOrCreate(
                    ['name' => $clubNames[$i % count($clubNames)]],
                    [
                        'organization_id' => $org->id,
                        'tax_number' => 'TN' . str_pad($clubIndex, 4, '0', STR_PAD_LEFT),
                        'invoice_prefix' => 'INV-' . str_pad($clubIndex, 3, '0', STR_PAD_LEFT),
                        'phone' => '+603-' . str_pad($clubIndex, 4, '0', STR_PAD_LEFT) . '-9999',
                        'website' => 'https://club' . $clubIndex . '.taekwondo.my',
                        'postal_code' => '50000',
                        'city' => $org->city,
                        'street' => ($clubIndex) . ' Jalan ' . $clubNames[$i % count($clubNames)],
                        'country' => 'Malaysia',
                        'status' => true,
                        'default_currency' => 'MYR',
                    ]
                );
                $clubs[] = $club;
            }
        }

        return $clubs;
    }

    private function createOrganizationClubUsers($organizations, $clubs)
    {
        // Create users for organizations
        foreach ($organizations as $index => $org) {
            User::updateOrCreate(
                ['email' => 'org' . ($index + 1) . '@example.com'],
                [
                    'name' => $org->name,
                    'password' => Hash::make('password123'),
                    'role' => 'organization',
                    'userable_type' => Organization::class,
                    'userable_id' => $org->id,
                ]
            );
        }

        // Create users for clubs
        foreach ($clubs as $index => $club) {
            User::updateOrCreate(
                ['email' => 'club' . ($index + 1) . '@example.com'],
                [
                    'name' => $club->name,
                    'password' => Hash::make('password123'),
                    'role' => 'club',
                    'userable_type' => Club::class,
                    'userable_id' => $club->id,
                ]
            );
        }
    }

    private function createPlans($organizations, $clubs)
    {
        $basePrices = [150, 200, 250, 300, 400, 500];
        $intervals = ['monthly', 'quarterly', 'semester', 'yearly'];

        // Organization plans
        foreach ($organizations as $org) {
            foreach ([150, 200, 250] as $price) {
                Plan::updateOrCreate(
                    [
                        'name' => 'Org Plan - ' . $price . ' MYR',
                        'planable_type' => Organization::class,
                        'planable_id' => $org->id,
                    ],
                    [
                        'base_amount' => $price,
                        'currency_code' => 'MYR',
                        'is_active' => true,
                        'description' => 'Organization level plan for ' . $org->name,
                        'interval' => 'monthly',
                        'discount_type' => null,
                        'discount_value' => 0,
                    ]
                );
            }
        }

        // Club plans
        foreach ($clubs as $club) {
            foreach ([100, 150, 200, 250] as $price) {
                Plan::updateOrCreate(
                    [
                        'name' => 'Club Plan - ' . $price . ' MYR',
                        'planable_type' => Club::class,
                        'planable_id' => $club->id,
                    ],
                    [
                        'base_amount' => $price,
                        'currency_code' => 'MYR',
                        'is_active' => true,
                        'description' => 'Club level plan for ' . $club->name,
                        'interval' => 'monthly',
                        'discount_type' => null,
                        'discount_value' => 0,
                    ]
                );
            }
        }
    }

    private function createStudents($organizations, $clubs)
    {
        $firstNames = ['Ahmad', 'Siti', 'Raj', 'Wei', 'Fatima', 'Karim', 'Nur', 'Hassan', 'Zahra', 'Ibrahim',
                      'Maryam', 'Ali', 'Leila', 'Mohammed', 'Aisha', 'Omar', 'Hana', 'Yusuf', 'Layla', 'Abdullah'];
        $lastNames = ['Hassan', 'Aminah', 'Kumar', 'Chen', 'Abdullah', 'Rahman', 'Ahmad', 'Ibrahim', 'Khan', 'Ali',
                     'Mohammed', 'Smith', 'Brown', 'Jones', 'Johnson', 'Williams', 'Taylor', 'Garcia', 'Rodriguez', 'Martinez'];
        $grades = ['White Belt', 'Yellow Belt', 'Blue Belt', 'Red Belt', 'Black Belt 1st Dan', 'Black Belt 2nd Dan'];
        $genders = ['Male', 'Female'];
        $nationalities = ['Malaysian', 'Indian', 'Chinese', 'Arab', 'British', 'American', 'Pakistani', 'Bangladeshi'];

        $students = [];
        $studentIndex = 0;

        foreach ($clubs as $club) {
            // Create 10 students per club (15 clubs = 150 students)
            for ($i = 0; $i < 10; $i++) {
                $studentIndex++;
                $firstName = $firstNames[$i % count($firstNames)];
                $lastName = $lastNames[$i % count($lastNames)];
                $birthYear = 2000 + rand(0, 24); // Ages from 0 to 24
                $birthMonth = rand(1, 12);
                $birthDay = rand(1, 28);

                $student = Student::updateOrCreate(
                    ['email' => 'student' . $studentIndex . '@example.com'],
                    [
                        'uid' => 'STU-' . str_pad($studentIndex, 5, '0', STR_PAD_LEFT),
                        'code' => 'S' . str_pad($studentIndex, 5, '0', STR_PAD_LEFT),
                        'name' => $firstName,
                        'surname' => $lastName,
                        'nationality' => $nationalities[$studentIndex % count($nationalities)],
                        'dob' => sprintf('%04d-%02d-%02d', $birthYear, $birthMonth, $birthDay),
                        'dod' => null,
                        'grade' => $grades[$i % count($grades)],
                        'gender' => $genders[$i % 2],
                        'id_passport' => 'ID' . str_pad($studentIndex, 6, '0', STR_PAD_LEFT),
                        'profile_image' => null,
                        'identification_document' => null,
                        'phone' => '+6012-' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
                        'city' => $club->city,
                        'postal_code' => $club->postal_code,
                        'street' => ($studentIndex * 10) . ' Jalan ' . $club->name,
                        'country' => 'Malaysia',
                        'status' => rand(0, 10) > 1 ? true : false, // 90% active, 10% inactive
                        'club_id' => $club->id,
                        'organization_id' => $club->organization_id,
                    ]
                );
                $students[] = $student;

                // Create user account for student
                User::updateOrCreate(
                    ['email' => 'student' . $studentIndex . '@example.com'],
                    [
                        'name' => $firstName . ' ' . $lastName,
                        'password' => Hash::make('password123'),
                        'role' => 'student',
                        'userable_type' => Student::class,
                        'userable_id' => $student->id,
                    ]
                );
            }
        }

        return $students;
    }

    private function createStudentFeePlans($students)
    {
        foreach ($students as $student) {
            $plans = Plan::where('planable_type', Club::class)
                ->where('planable_id', $student->club_id)
                ->get();

            if ($plans->count() > 0) {
                $randomPlan = $plans->random();
                $interval = ['monthly', 'quarterly', 'semester', 'yearly'][rand(0, 3)];

                StudentFeePlan::updateOrCreate(
                    ['student_id' => $student->id],
                    [
                        'plan_id' => $randomPlan->id,
                        'interval' => $interval,
                        'interval_count' => $interval === 'custom' ? rand(1, 3) : null,
                        'discount_type' => rand(0, 5) > 3 ? 'percent' : null,
                        'discount_value' => rand(0, 5) > 3 ? rand(5, 20) : 0,
                        'currency_code' => 'MYR',
                        'is_active' => true,
                    ]
                );
            }
        }
    }

    private function createInstructors($organizations, $clubs)
    {
        $firstNames = ['Ahmad', 'Siti', 'Raj', 'Wei', 'Fatima', 'Karim', 'Master', 'Sensei', 'Coach'];
        $lastNames = ['Hassan', 'Aminah', 'Kumar', 'Chen', 'Abdullah', 'Rahman', 'Lee', 'Wong'];
        $grades = ['White Belt', 'Yellow Belt', 'Blue Belt', 'Red Belt', 'Black Belt 1st Dan', 'Black Belt 2nd Dan'];
        $genders = ['male', 'female'];

        $instructorIndex = 0;
        foreach ($clubs as $club) {
            // Create 2-3 instructors per club
            $instructorCount = rand(2, 3);
            for ($i = 0; $i < $instructorCount; $i++) {
                $instructorIndex++;
                $firstName = $firstNames[$i % count($firstNames)];
                $lastName = $lastNames[$i % count($lastNames)];

                $instructor = Instructor::updateOrCreate(
                    ['email' => 'instructor' . $instructorIndex . '@example.com'],
                    [
                        'name' => $firstName . ' ' . $lastName,
                        'gender' => $genders[$i % 2],
                        'mobile' => '+6012-' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
                        'grade' => $grades[$i % count($grades)],
                        'club_id' => $club->id,
                        'organization_id' => $club->organization_id,
                    ]
                );

                // Create user account for instructor
                User::updateOrCreate(
                    ['email' => 'instructor' . $instructorIndex . '@example.com'],
                    [
                        'name' => $firstName . ' ' . $lastName,
                        'password' => Hash::make('password123'),
                        'role' => 'instructor',
                        'userable_type' => Instructor::class,
                        'userable_id' => $instructor->id,
                    ]
                );
            }
        }
    }

    private function createPayments($students)
    {
        $methods = ['bank_transfer', 'cash', 'credit_card', 'online_payment'];

        foreach ($students as $student) {
            // Create 3-5 payments per student
            $paymentCount = rand(3, 5);
            for ($i = 0; $i < $paymentCount; $i++) {
                $monthOffset = -$i * 30; // Different months for each payment
                $payDate = Carbon::now()->addDays($monthOffset);

                // Random amount between 100-400
                $amount = rand(100, 400);

                // 70% paid, 30% unpaid
                $status = rand(0, 10) > 3 ? 'paid' : 'unpaid';

                try {
                    Payment::updateOrCreate(
                        [
                            'student_id' => $student->id,
                            'month' => $payDate->format('Y-m'),
                        ],
                        [
                            'amount' => $amount,
                            'currency_code' => 'MYR',
                            'status' => $status,
                            'method' => $methods[rand(0, count($methods) - 1)],
                            'pay_at' => $payDate,
                            'notes' => 'Monthly payment for ' . $payDate->format('F Y'),
                        ]
                    );
                } catch (\Exception $e) {
                    // Skip if payment creation fails
                    continue;
                }
            }
        }
    }

    private function createAttendances($students)
    {
        // Create attendance records for the last 3 months
        $statuses = ['present', 'absent', 'late', 'excused'];
        $startDate = Carbon::now()->subMonths(3)->startOfMonth();
        $endDate = Carbon::now();

        foreach ($students as $student) {
            $currentDate = $startDate->copy();

            // Create attendance for each day from startDate to endDate (weekdays only)
            while ($currentDate <= $endDate) {
                // Skip weekends
                if ($currentDate->isWeekday()) {
                    // 85% probability of attendance record
                    if (rand(0, 100) < 85) {
                        Attendance::updateOrCreate(
                            [
                                'student_id' => $student->id,
                                'date' => $currentDate->format('Y-m-d'),
                            ],
                            [
                                'status' => $statuses[rand(0, count($statuses) - 1)],
                                'remarks' => rand(0, 10) > 8 ? 'Sick leave' : null,
                            ]
                        );
                    }
                }
                $currentDate->addDay();
            }
        }
    }
}
