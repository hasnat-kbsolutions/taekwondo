import React, { useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button as ShadButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface Payment {
    id: number;
    student_id: number;
    month?: string;
    notes: string;
    amount: string;
    status: "paid" | "unpaid";
    method: "cash" | "card" | "stripe";
    pay_at: string;
    due_date?: string;
    transaction_id?: string;
    currency_code: string;
    bank_information?: any[];
    student?: {
        id: number;
        name: string;
        surname?: string;
    };
}

interface Student {
    id: number;
    name: string;
    surname?: string;
}

interface BankInformation {
    id: number;
    bank_name: string;
    account_name: string;
    account_number: string;
    currency: string;
}

interface Currency {
    code: string;
    name: string;
    symbol: string;
}

interface Props {
    payment: Payment;
    students: Student[];
    studentFeePlans: any[];
    bank_information: BankInformation[];
    currencies: Currency[];
}

export default function Edit({
    payment,
    students = [],
    studentFeePlans = [],
    bank_information = [],
    currencies = [],
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: payment.student_id || "",
        month: payment.month || "",
        notes: payment.notes || "",
        amount: payment.amount || "",
        status: payment.status || "unpaid",
        method: payment.method || "cash",
        pay_at: payment.pay_at || "",
        due_date: payment.due_date || "",
        transaction_id: payment.transaction_id || "",
        currency_code: payment.currency_code || "MYR",
        bank_information:
            payment.bank_information?.map((bank: any) => bank.id) || [],
    });

    const selectedPlan = useMemo(() => {
        if (!data.student_id) return null;
        return (studentFeePlans as any[]).find(
            (p) => String(p.student_id) === String(data.student_id)
        );
    }, [data.student_id, studentFeePlans]);

    const handleChange = (field: keyof typeof data, value: string) => {
        setData(field, value);
        if (field === "student_id") {
            const plan = (studentFeePlans as any[]).find(
                (p) => String(p.student_id) === String(value)
            );
            if (plan) {
                if (typeof plan.effective_amount !== "undefined") {
                    setData("amount", String(plan.effective_amount));
                }
                const planCurrency =
                    plan.currency_code || plan.plan?.currency_code;
                if (planCurrency) {
                    setData("currency_code", planCurrency);
                }
            }
        }
    };

    const handleBankSelection = (bankId: number, checked: boolean) => {
        const currentBanks = data.bank_information as number[];
        const updatedBanks = checked
            ? [...currentBanks, bankId]
            : currentBanks.filter((id: number) => id !== bankId);
        setData("bank_information", updatedBanks);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("organization.payments.update", payment.id));
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Edit Payment">
            <Head title="Edit Payment" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Student */}
                                <div>
                                    <Label>
                                        Student
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={String(data.student_id || "")}
                                        onValueChange={(value) =>
                                            handleChange("student_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students && students.length > 0 ? (
                                                students.map((s) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={String(s.id)}
                                                >
                                                        {s.name}{" "}
                                                        {s.surname || ""}
                                                </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    No students available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {renderError("student_id")}
                                </div>

                                {/* Month */}
                                <div>
                                    <Label>Month (YYYY-MM)</Label>
                                    <Input
                                        type="month"
                                        value={data.month}
                                        onChange={(e) =>
                                            handleChange(
                                                "month",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {renderError("month")}
                                </div>

                                {/* Status */}
                                <div>
                                    <Label>
                                        Status
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            handleChange("status", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unpaid">
                                                Unpaid
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {renderError("status")}
                                </div>

                                {/* Method */}
                                <div>
                                    <Label>
                                        Method
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.method}
                                        onValueChange={(value) =>
                                            handleChange("method", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">
                                                Cash
                                            </SelectItem>
                                            <SelectItem value="card">
                                                Card
                                            </SelectItem>
                                            <SelectItem value="stripe">
                                                Stripe
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {renderError("method")}
                                </div>

                                <div>
                                    <Label>Transaction ID</Label>
                                    <Input
                                        type="text"
                                        value={data.transaction_id}
                                        onChange={(e) =>
                                            handleChange(
                                                "transaction_id",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Optional transaction ID"
                                    />
                                    {renderError("transaction_id")}
                                </div>

                                <div>
                                    <Label>Pay At</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <ShadButton
                                                variant={"outline"}
                                                className={
                                                    "w-full justify-start text-left font-normal " +
                                                    (!data.pay_at &&
                                                        "text-muted-foreground")
                                                }
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {data.pay_at
                                                    ? format(
                                                          new Date(data.pay_at),
                                                          "PPP"
                                                      )
                                                    : "Pick a date"}
                                            </ShadButton>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    data.pay_at
                                                        ? new Date(data.pay_at)
                                                        : undefined
                                                }
                                                onSelect={(date) =>
                                                    handleChange(
                                                        "pay_at",
                                                        date
                                                            ? format(
                                                                  date,
                                                                  "yyyy-MM-dd"
                                                              )
                                                            : ""
                                                    )
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {renderError("pay_at")}
                                </div>
                                <div>
                                    <Label>Due Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <ShadButton
                                                variant={"outline"}
                                                className={
                                                    "w-full justify-start text-left font-normal " +
                                                    (!data.due_date &&
                                                        "text-muted-foreground")
                                                }
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {data.due_date
                                                    ? format(
                                                          new Date(
                                                              data.due_date
                                                          ),
                                                          "PPP"
                                                      )
                                                    : "Pick a date"}
                                            </ShadButton>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    data.due_date
                                                        ? new Date(
                                                              data.due_date
                                                          )
                                                        : undefined
                                                }
                                                onSelect={(date) =>
                                                    handleChange(
                                                        "due_date",
                                                        date
                                                            ? format(
                                                                  date,
                                                                  "yyyy-MM-dd"
                                                              )
                                                            : ""
                                                    )
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {renderError("due_date")}
                                </div>

                                {/* Fee Plan Details (full width, after Due Date) */}
                                <div className="col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Fee Plan Details
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Plan</Label>
                                                <div className="mt-1 text-sm">
                                                    {selectedPlan?.plan?.name ||
                                                        "Custom"}
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Currency</Label>
                                                <div className="mt-1 text-sm">
                                                    {selectedPlan?.currency_code ||
                                                        selectedPlan?.plan
                                                            ?.currency_code ||
                                                        "-"}
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Base Amount</Label>
                                                <div className="mt-1 text-sm">
                                                    {typeof selectedPlan?.base_amount !==
                                                    "undefined"
                                                        ? selectedPlan?.base_amount
                                                        : "-"}
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Effective Amount</Label>
                                                <div className="mt-1 text-sm">
                                                    {typeof selectedPlan?.effective_amount !==
                                                    "undefined"
                                                        ? selectedPlan?.effective_amount
                                                        : "-"}
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Interval</Label>
                                                <div className="mt-1 text-sm">
                                                    {selectedPlan?.interval}
                                                    {selectedPlan?.interval ===
                                                        "custom" &&
                                                    selectedPlan?.interval_count
                                                        ? ` (${selectedPlan?.interval_count})`
                                                        : ""}
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Discount</Label>
                                                <div className="mt-1 text-sm">
                                                    {selectedPlan?.discount_type
                                                        ? `${selectedPlan?.discount_type} ${selectedPlan?.discount_value}`
                                                        : "None"}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Notes moved below to allow full-width Fee Plan Details */}
                            </div>

                            {/* Notes */}
                            <div>
                                    <Label>Notes</Label>
                                    <Input
                                        value={data.notes}
                                        onChange={(e) =>
                                        handleChange("notes", e.target.value)
                                        }
                                    />
                            </div>

                            {/* Bank Information Selection */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">
                                    Bank Information (Select banks to show on
                                    invoice)
                                </Label>
                                {bank_information &&
                                bank_information.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {bank_information.map((bank) => (
                                            <div
                                                key={bank.id}
                                                className="flex items-center space-x-2 p-3 border rounded-lg"
                                            >
                                                <Checkbox
                                                    id={`bank-${bank.id}`}
                                                    checked={(
                                                        data.bank_information as number[]
                                                    ).includes(bank.id)}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleBankSelection(
                                                            bank.id,
                                                            checked as boolean
                                                        )
                                                    }
                                                />
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor={`bank-${bank.id}`}
                                                        className="text-sm font-medium cursor-pointer"
                                                    >
                                                        {bank.bank_name}
                                                    </Label>
                                                    <div className="text-xs text-muted-foreground">
                                                        {bank.account_name} -{" "}
                                                        {bank.account_number}
                                                        {bank.currency &&
                                                            ` (${bank.currency})`}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                                        <p>No bank information available.</p>
                                        <p className="text-sm">
                                            Please add bank information first.
                                        </p>
                                    </div>
                                )}
                                {renderError("bank_information")}
                            </div>

                            <div className="pt-4">
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
