<?php

namespace App\Observers;

use App\Models\StudentFeePlan;
use App\Models\Payment;
use Carbon\Carbon;

class StudentFeePlanObserver
{
    /**
     * Handle the StudentFeePlan "created" event.
     */
    public function created(StudentFeePlan $feePlan): void
    {
        // Auto-generate the first payment when a fee plan is assigned
        $this->generateInitialPayment($feePlan);
    }

    /**
     * Handle the StudentFeePlan "updated" event.
     */
    public function updated(StudentFeePlan $feePlan): void
    {
        // Don't generate new payments on update, just log the change
    }

    /**
     * Generate the initial payment for a new fee plan
     */
    private function generateInitialPayment(StudentFeePlan $feePlan): void
    {
        // Only generate if the fee plan is active
        if (!$feePlan->is_active) {
            return;
        }

        // Get the effective amount (considering discounts)
        $amount = $feePlan->base_amount;

        // Apply discount if applicable
        if ($feePlan->discount_type && $feePlan->discount_value) {
            if ($feePlan->discount_type === 'percent') {
                $amount = $amount - ($amount * $feePlan->discount_value / 100);
            } elseif ($feePlan->discount_type === 'fixed') {
                $amount = $amount - $feePlan->discount_value;
            }
        }

        // Determine the payment month (current month or effective_from month)
        $paymentMonth = $feePlan->effective_from
            ? Carbon::parse($feePlan->effective_from)->format('Y-m')
            : now()->format('Y-m');

        // Calculate due date based on interval
        $dueDate = $this->calculateDueDate($feePlan, $paymentMonth);

        // Check if payment already exists for this month
        $existingPayment = Payment::where('student_id', $feePlan->student_id)
            ->where('month', $paymentMonth)
            ->exists();

        if (!$existingPayment && $amount > 0) {
            Payment::create([
                'student_id' => $feePlan->student_id,
                'amount' => $amount,
                'month' => $paymentMonth,
                'status' => 'unpaid',
                'currency_code' => $feePlan->currency_code ?? 'MYR',
                'due_date' => $dueDate,
            ]);
        }
    }

    /**
     * Calculate the due date for a payment based on the fee plan interval
     */
    private function calculateDueDate(StudentFeePlan $feePlan, string $paymentMonth): ?Carbon
    {
        $date = Carbon::createFromFormat('Y-m', $paymentMonth)->endOfMonth();

        // Add additional days for payment due date (e.g., 10 days after month end)
        return $date->addDays(10);
    }
}
