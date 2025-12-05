<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Controllers\GradeHistoryController;
use App\Models\Student;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GradeReportController extends Controller
{
    /**
     * Show student's own grade progression and payment history
     */
    public function show()
    {
        $user = Auth::user();
        $student = Student::find($user->userable_id);

        if (!$student) {
            abort(404, 'Student not found');
        }

        // Get grade history
        $gradeHistory = $student->gradeHistories()
            ->orderBy('achieved_at', 'desc')
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'grade_name' => $history->grade_name,
                    'achieved_at' => $history->achieved_at->format('Y-m-d'),
                    'achieved_at_formatted' => $history->achieved_at->format('M d, Y'),
                    'duration_days' => $history->duration_days,
                    'duration_formatted' => $this->formatDuration($history->duration_days),
                    'notes' => $history->notes,
                ];
            });

        // Get payment history
        $payments = Payment::where('student_id', $student->id)
            ->orderBy('pay_at', 'desc')
            ->get()
            ->map(function ($payment) {
                $payAt = $payment->pay_at ? \Carbon\Carbon::parse($payment->pay_at) : null;
                return [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'currency' => $payment->currency_code ?? 'MYR',
                    'payment_date' => $payAt?->format('Y-m-d'),
                    'payment_date_formatted' => $payAt?->format('M d, Y') ?? '-',
                    'status' => $payment->status,
                    'description' => $payment->notes,
                    'payment_method' => $payment->method,
                ];
            });

        $stats = GradeHistoryController::getGradeStats($student);

        return Inertia::render('Student/GradeReport/Show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name . ' ' . ($student->surname ?? ''),
                'code' => $student->code,
                'grade' => $student->grade,
                'club' => $student->club?->name,
                'profile_image' => $student->profile_image,
            ],
            'gradeHistory' => $gradeHistory,
            'payments' => $payments,
            'stats' => $stats,
        ]);
    }

    /**
     * Format duration in days to human-readable format
     */
    private function formatDuration($days)
    {
        if (!$days) {
            return 'Current';
        }

        $years = intdiv($days, 365);
        $months = intdiv(($days % 365), 30);
        $remainingDays = $days % 30;

        $parts = [];
        if ($years > 0) $parts[] = "$years year" . ($years > 1 ? 's' : '');
        if ($months > 0) $parts[] = "$months month" . ($months > 1 ? 's' : '');
        if ($remainingDays > 0 || empty($parts)) $parts[] = "$remainingDays day" . ($remainingDays > 1 ? 's' : '');

        return implode(', ', array_slice($parts, 0, 2));
    }
}
