<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Organization;
use App\Models\StudentFeePlan;
use App\Models\Student;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = Organization::all();

        if ($organizations->count() === 0) {
            $this->command->info('Skipping PlanSeeder: No organizations found.');
            return;
        }

        foreach ($organizations as $org) {
            // Create plans for each organization if they don't exist
            $plan1 = Plan::firstOrCreate(
                [
                    'name' => 'Basic Plan',
                    'planable_type' => 'App\Models\Organization',
                    'planable_id' => $org->id,
                ],
                [
                    'description' => 'Basic monthly membership',
                    'base_amount' => 50,
                    'currency_code' => 'USD',
                    'interval' => 'monthly',
                    'interval_count' => 1,
                    'is_active' => true,
                ]
            );

            $plan2 = Plan::firstOrCreate(
                [
                    'name' => 'Standard Plan',
                    'planable_type' => 'App\Models\Organization',
                    'planable_id' => $org->id,
                ],
                [
                    'description' => 'Quarterly membership',
                    'base_amount' => 130,
                    'currency_code' => 'USD',
                    'interval' => 'quarterly',
                    'interval_count' => 3,
                    'is_active' => true,
                ]
            );

            $plan3 = Plan::firstOrCreate(
                [
                    'name' => 'Premium Plan',
                    'planable_type' => 'App\Models\Organization',
                    'planable_id' => $org->id,
                ],
                [
                    'description' => 'Yearly membership',
                    'base_amount' => 500,
                    'currency_code' => 'USD',
                    'interval' => 'yearly',
                    'interval_count' => 12,
                    'is_active' => true,
                ]
            );

            // Get students of this organization and assign plans
            $students = Student::where('organization_id', $org->id)->get();
            $plans = [$plan1, $plan2, $plan3];

            foreach ($students as $index => $student) {
                // Check if student already has a fee plan
                $existingFeePlan = StudentFeePlan::where('student_id', $student->id)->first();

                if ($existingFeePlan) {
                    continue;
                }

                // Assign a plan randomly
                $plan = $plans[$index % 3];

                StudentFeePlan::create([
                    'student_id' => $student->id,
                    'plan_id' => $plan->id,
                    'interval' => $plan->interval,
                    'interval_count' => $plan->interval_count,
                    'is_active' => true,
                ]);
            }

            $this->command->info("Created 3 plans for organization: {$org->name}");
        }

        $this->command->info('Plans and Student Fee Plans seeded successfully.');
    }
}
