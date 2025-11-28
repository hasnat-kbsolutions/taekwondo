<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\StudentFeePlan;

class StudentFeePlanAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    protected StudentFeePlan $feePlan;

    /**
     * Create a new notification instance.
     */
    public function __construct(StudentFeePlan $feePlan)
    {
        $this->feePlan = $feePlan;
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
        $planName = $this->feePlan->plan?->name ?? 'Your Fee Plan';
        $amount = $this->feePlan->custom_amount ?? $this->feePlan->plan?->base_amount ?? 0;
        $currency = $this->feePlan->currency_code ?? 'MYR';
        $interval = ucfirst($this->feePlan->interval);

        return (new MailMessage)
            ->subject('Fee Plan Assignment - ' . $planName)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('A new fee plan has been assigned to your student account.')
            ->line('**Plan Details:**')
            ->line('Plan Name: ' . $planName)
            ->line('Amount: ' . $currency . ' ' . number_format($amount, 2))
            ->line('Billing Interval: ' . $interval)
            ->when($this->feePlan->discount_type, function ($mail) {
                $discountLabel = $this->feePlan->discount_type === 'percent'
                    ? $this->feePlan->discount_value . '%'
                    : $this->feePlan->currency_code . ' ' . number_format($this->feePlan->discount_value, 2);
                return $mail->line('Discount: ' . $discountLabel);
            })
            ->action('View Fee Plan Details', url('/student/fee-plan'))
            ->line('If you have any questions about your fee plan, please contact your club administrator.')
            ->salutation('Best regards, Taekwondo Management System');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        $planName = $this->feePlan->plan?->name ?? 'Your Fee Plan';
        $amount = $this->feePlan->custom_amount ?? $this->feePlan->plan?->base_amount ?? 0;
        $currency = $this->feePlan->currency_code ?? 'MYR';

        return [
            'title' => 'Fee Plan Assigned',
            'message' => "A new fee plan '{$planName}' has been assigned to you. Amount: {$currency} " . number_format($amount, 2),
            'plan_id' => $this->feePlan->plan_id,
            'plan_name' => $planName,
            'amount' => $amount,
            'currency' => $currency,
            'interval' => $this->feePlan->interval,
            'action_url' => '/student/fee-plan',
        ];
    }
}
