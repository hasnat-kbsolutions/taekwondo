<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Payment;
use App\Models\Student;

class PaymentProofUploaded extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Payment $payment, public Student $student)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting('Payment Proof Uploaded')
            ->line('Student ' . $this->student->name . ' has uploaded payment proof for month: ' . $this->payment->month)
            ->line('Amount: ' . $this->payment->amount . ' ' . ($this->payment->currency_code ?? 'MYR'))
            ->action('Review Payment', route('club.payments.index'))
            ->line('Please verify the uploaded proof and approve or request resubmission.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'payment_id' => $this->payment->id,
            'student_id' => $this->student->id,
            'student_name' => $this->student->name,
            'month' => $this->payment->month,
            'amount' => $this->payment->amount,
            'currency_code' => $this->payment->currency_code ?? 'MYR',
            'message' => $this->student->name . ' uploaded payment proof for ' . $this->payment->month,
        ];
    }
}
