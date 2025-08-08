<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Student;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();

        // Check if we have students
        if ($students->count() === 0) {
            $this->command->info('Skipping PaymentSeeder: No students found.');
            return;
        }

        $payments = [
            [
                'student_id' => $students->first()->id,
                'amount' => 150.00,
                'method' => 'cash',
                'status' => 'paid',
                'payment_month' => '2024-01',
                'pay_at' => '2024-01-01',
                'notes' => 'Monthly membership fee - January 2024',
                'transaction_id' => 'INV-2024-001',
            ],
            [
                'student_id' => $students->first()->id,
                'amount' => 50.00,
                'method' => 'bank_transfer',
                'status' => 'paid',
                'payment_month' => '2024-01',
                'pay_at' => '2024-01-15',
                'notes' => 'Belt promotion fee',
                'transaction_id' => 'INV-2024-002',
            ],
        ];

        // Add more payment records if we have more students
        if ($students->count() >= 2) {
            $payments[] = [
                'student_id' => $students->skip(1)->first()->id,
                'amount' => 150.00,
                'method' => 'credit_card',
                'status' => 'paid',
                'payment_month' => '2024-01',
                'pay_at' => '2024-01-01',
                'notes' => 'Monthly membership fee - January 2024',
                'transaction_id' => 'INV-2024-003',
            ];
            $payments[] = [
                'student_id' => $students->skip(1)->first()->id,
                'amount' => 75.00,
                'method' => 'cash',
                'status' => 'pending',
                'payment_month' => '2024-01',
                'pay_at' => '2024-01-20',
                'notes' => 'Competition registration fee',
                'transaction_id' => 'INV-2024-004',
            ];
        }

        if ($students->count() >= 3) {
            $payments[] = [
                'student_id' => $students->skip(2)->first()->id,
                'amount' => 200.00,
                'method' => 'bank_transfer',
                'status' => 'paid',
                'payment_month' => '2024-01',
                'pay_at' => '2024-01-01',
                'notes' => 'Advanced training program fee',
                'transaction_id' => 'INV-2024-005',
            ];
            $payments[] = [
                'student_id' => $students->skip(2)->first()->id,
                'amount' => 100.00,
                'method' => 'credit_card',
                'status' => 'paid',
                'payment_month' => '2024-01',
                'pay_at' => '2024-01-25',
                'notes' => 'Black belt testing fee',
                'transaction_id' => 'INV-2024-006',
            ];
        }

        $createdCount = 0;
        foreach ($payments as $payment) {
            Payment::create($payment);
            $createdCount++;
        }

        $this->command->info("Created {$createdCount} payment records successfully.");
    }
}