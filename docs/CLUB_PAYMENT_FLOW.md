# Club Payment, Plan, and Student Fee Plan Flow

## Overview

This document describes the flow of **Plans**, **Student Fee Plans**, and **Payments** on the club side of the application.

## Entity Relationships

### 1. **Club** → **Plan** (One-to-Many)

-   A Club can have multiple Plans
-   Plans are polymorphically associated with Clubs via `planable_type` and `planable_id`
-   Each Plan has:
    -   `name`: Unique name within the club
    -   `base_amount`: Base fee amount
    -   `currency_code`: Currency for the plan
    -   `is_active`: Whether the plan is active
    -   `description`: Optional description

### 2. **Plan** → **StudentFeePlan** (One-to-Many)

-   A Plan can be assigned to multiple students
-   A StudentFeePlan can optionally reference a Plan (can be null for custom plans)

### 3. **Student** → **StudentFeePlan** (One-to-One)

-   Each Student can have exactly ONE StudentFeePlan
-   The `student_id` field in `student_fee_plans` table has a unique constraint

### 4. **Student** → **Payment** (One-to-Many)

-   A Student can have multiple Payments
-   Payments are created manually or generated from StudentFeePlans

## Flow Diagram

```
Club
  └── Plans (created by club)
      ├── Plan 1: "Basic Plan" - RM 100/month
      ├── Plan 2: "Premium Plan" - RM 200/month
      └── Plan 3: "Custom Plan" - RM 150/month

Student
  └── StudentFeePlan (one per student)
      ├── References a Plan (optional)
      ├── Can have custom_amount (overrides plan base_amount)
      ├── Has discount_type and discount_value
      ├── Has interval (monthly, quarterly, semester, yearly, custom)
      └── Calculates effective_amount (base_amount - discount)

StudentFeePlan
  └── Generates Payments
      ├── Manual creation
      └── Bulk generation (from active fee plans)
```

## Detailed Flow

### Step 1: Creating Plans (Club Side)

**Controller**: `App\Http\Controllers\Club\PlanController`

**Routes**:

-   `GET /club/plans` - List all plans for the club
-   `GET /club/plans/create` - Show create form
-   `POST /club/plans` - Create a new plan
-   `GET /club/plans/{plan}/edit` - Show edit form
-   `PUT /club/plans/{plan}` - Update plan
-   `DELETE /club/plans/{plan}` - Delete plan

**Key Points**:

-   Plans are scoped to the authenticated club user
-   Plan names must be unique within the club
-   Plans use polymorphic relationship: `planable_type = 'App\Models\Club'` and `planable_id = club_id`

**Example**:

```php
Plan::create([
    'name' => 'Monthly Training',
    'base_amount' => 100.00,
    'currency_code' => 'MYR',
    'is_active' => true,
    'description' => 'Monthly training fee',
    'planable_type' => 'App\Models\Club',
    'planable_id' => $clubId,
]);
```

### Step 2: Assigning Student Fee Plans (Club Side)

**Controller**: `App\Http\Controllers\Club\StudentFeePlanController`

**Routes**:

-   `GET /club/student-fee-plans` - List all student fee plans
-   `GET /club/student-fee-plans/create` - Show create form
-   `POST /club/student-fee-plans` - Create a new student fee plan
-   `GET /club/student-fee-plans/{studentFeePlan}/edit` - Show edit form
-   `PUT /club/student-fee-plans/{studentFeePlan}` - Update student fee plan
-   `DELETE /club/student-fee-plans/{studentFeePlan}` - Delete student fee plan

**Key Points**:

-   Each student can have only ONE fee plan (unique constraint on `student_id`)
-   A fee plan can optionally reference a Plan
-   If no plan is referenced, `custom_amount` must be provided
-   Fee plans support discounts (percent or fixed)
-   Fee plans have intervals: monthly, quarterly, semester, yearly, or custom
-   The `effective_amount` is calculated as: `base_amount - discount`

**Amount Calculation Logic**:

```php
// Base amount: custom_amount OR plan->base_amount OR 0
$base = $custom_amount ?? $plan?->base_amount ?? 0;

// Discount calculation
if ($discount_type === 'percent') {
    $discount = $base * ($discount_value / 100);
} elseif ($discount_type === 'fixed') {
    $discount = $discount_value;
} else {
    $discount = 0;
}

// Effective amount
$effective_amount = max($base - $discount, 0);
```

**Example**:

```php
StudentFeePlan::create([
    'student_id' => 1,
    'plan_id' => 1, // References Plan
    'custom_amount' => null, // Uses plan's base_amount
    'currency_code' => 'MYR',
    'interval' => 'monthly',
    'discount_type' => 'percent',
    'discount_value' => 10, // 10% discount
    'is_active' => true,
]);
```

### Step 3: Creating Payments (Club Side)

**Controller**: `App\Http\Controllers\Club\PaymentController`

**Routes**:

-   `GET /club/payments` - List all payments (with filters)
-   `GET /club/payments/create` - Show create form (only shows students with fee plans)
-   `POST /club/payments` - Create a new payment
-   `GET /club/payments/bulk-generate` - Show bulk generation form
-   `POST /club/payments/bulk-generate` - Generate payments for all active fee plans
-   `GET /club/payments/{payment}/edit` - Show edit form
-   `PUT /club/payments/{payment}` - Update payment
-   `DELETE /club/payments/{payment}` - Delete payment
-   `PATCH /club/payments/{payment}/status` - Update payment status

#### 3.1 Manual Payment Creation

**Key Points**:

-   Only students with fee plans can be selected for payment creation
-   Payments can be created independently of fee plans
-   Payment amount can be different from fee plan's effective_amount
-   Payments support attachments (receipts, etc.)

**Payment Fields**:

-   `student_id`: Required
-   `month`: Optional (format: YYYY-MM)
-   `amount`: Required
-   `currency_code`: Required
-   `status`: Required (paid/unpaid)
-   `method`: Required (cash/card/stripe)
-   `pay_at`: Optional (defaults to now)
-   `due_date`: Optional
-   `notes`: Optional
-   `transaction_id`: Optional
-   `bank_information`: Optional (array of bank info IDs)

#### 3.2 Bulk Payment Generation

**Key Points**:

-   Generates payments for all students with active fee plans
-   Skips students who already have a payment for the specified month
-   Uses `effective_amount` from the student's fee plan
-   Sets default values:
    -   `status`: 'unpaid'
    -   `method`: 'cash'
    -   `due_date`: End of the specified month

**Flow**:

1. Club selects a month (YYYY-MM format)
2. System finds all active StudentFeePlans for the club's students
3. For each fee plan:
    - Check if payment already exists for that student and month
    - If not, create payment with:
        - `amount` = fee plan's `effective_amount`
        - `currency_code` = fee plan's `currency_code` OR plan's `currency_code` OR 'MYR'
        - `month` = selected month
        - `due_date` = end of month
        - `status` = 'unpaid'

**Example**:

```php
// For each active fee plan
Payment::create([
    'student_id' => $feePlan->student_id,
    'month' => '2024-01',
    'amount' => $feePlan->effective_amount, // Calculated amount
    'currency_code' => $feePlan->currency_code ?? $feePlan->plan?->currency_code ?? 'MYR',
    'status' => 'unpaid',
    'method' => 'cash',
    'due_date' => '2024-01-31',
]);
```

## Security & Authorization

All club-side operations verify:

1. User is authenticated and has role 'club'
2. The club_id matches the authenticated user's `userable_id`
3. Students belong to the club before creating/updating payments or fee plans
4. Plans belong to the club before editing/deleting

## Data Flow Summary

1. **Club creates Plans** → Templates for fee structures
2. **Club assigns StudentFeePlans to Students** → Links students to plans with customizations
3. **Club creates Payments** → Either:
    - **Manually**: Create individual payments
    - **Bulk**: Generate payments from active fee plans for a specific month

## Important Notes

1. **One Student = One Fee Plan**: The database enforces uniqueness on `student_id` in `student_fee_plans` table
2. **Fee Plans are Optional**: Students don't need fee plans to have payments, but bulk generation requires them
3. **Amount Flexibility**: Payment amounts can differ from fee plan amounts (manual override)
4. **Currency Handling**: Currency flows: Payment → StudentFeePlan → Plan (with fallbacks)
5. **Bulk Generation**: Only generates for active fee plans and skips existing payments

## Database Schema Highlights

### Plans Table

-   `planable_type`: 'App\Models\Club'
-   `planable_id`: Club ID
-   `name`: Unique per club
-   `base_amount`: Base fee amount
-   `currency_code`: Currency

### Student Fee Plans Table

-   `student_id`: Unique (one per student)
-   `plan_id`: Nullable (references Plan)
-   `custom_amount`: Nullable (overrides plan amount)
-   `interval`: monthly/quarterly/semester/yearly/custom
-   `discount_type`: percent/fixed
-   `discount_value`: Discount amount
-   `is_active`: Boolean

### Payments Table

-   `student_id`: References Student
-   `month`: YYYY-MM format
-   `amount`: Payment amount
-   `currency_code`: Currency
-   `status`: paid/unpaid
-   `method`: cash/card/stripe
-   `bank_information`: JSON array
