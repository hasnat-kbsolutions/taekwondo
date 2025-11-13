import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

export default function Create() {
    const {
        studentFees = [],
        currencies = [],
        bank_information = [],
        errors = {},
    } = usePage().props as any;

    const [form, setForm] = useState({
        student_fee_id: "",
        amount: "",
        currency_code: "MYR",
        status: "successful",
        method: "cash",
        pay_at: "",
        notes: "",
        transaction_id: "",
        bank_information: [] as number[],
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleBankSelection = (bankId: number, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            bank_information: checked
                ? [...prev.bank_information, bankId]
                : prev.bank_information.filter((id: number) => id !== bankId),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route("admin.payments.store"), form);
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );
    return (
        <AuthenticatedLayout header="Add Payment">
            <Head title="Add Payment" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>
                                        Student Fee
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.student_fee_id}
                                        onValueChange={(value) =>
                                            handleChange(
                                                "student_fee_id",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Student Fee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {studentFees &&
                                            Array.isArray(studentFees) &&
                                            studentFees.length > 0 ? (
                                                studentFees.map((sf: any) => (
                                                    <SelectItem
                                                        key={sf.id}
                                                        value={String(sf.id)}
                                                    >
                                                        {sf.student?.name}{" "}
                                                        {sf.student?.surname} -{" "}
                                                        {sf.fee_type?.name} (
                                                        {sf.month}) -{" "}
                                                        {sf.status}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    No pending fees available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {renderError("student_fee_id")}
                                </div>
                                <div>
                                    <Label>
                                        Amount
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.amount}
                                        onChange={(e) =>
                                            handleChange(
                                                "amount",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {renderError("amount")}
                                </div>
                                <div>
                                    <Label>
                                        Currency
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.currency_code}
                                        onValueChange={(value) =>
                                            handleChange("currency_code", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((currency: any) => (
                                                <SelectItem
                                                    key={currency.code}
                                                    value={currency.code}
                                                >
                                                    {currency.code} -{" "}
                                                    {currency.symbol}{" "}
                                                    {currency.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError("currency_code")}
                                </div>
                                <div>
                                    <Label>
                                        Status
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.status}
                                        onValueChange={(value) =>
                                            handleChange("status", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="successful">
                                                Successful
                                            </SelectItem>
                                            <SelectItem value="failed">
                                                Failed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {renderError("status")}
                                </div>

                                <div>
                                    <Label>
                                        Method
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.method}
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
                                        value={form.transaction_id}
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
                                                    (!form.pay_at &&
                                                        "text-muted-foreground")
                                                }
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {form.pay_at
                                                    ? format(
                                                          new Date(form.pay_at),
                                                          "PPP"
                                                      )
                                                    : "Pick a date"}
                                            </ShadButton>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    form.pay_at
                                                        ? new Date(form.pay_at)
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

                                <div className="col-span-3">
                                    <Label>Notes</Label>
                                    <Input
                                        value={form.notes}
                                        onChange={(e) =>
                                            handleChange(
                                                "notes",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
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
                                        {bank_information.map((bank: any) => (
                                            <div
                                                key={bank.id}
                                                className="flex items-center space-x-2 p-3 border rounded-lg"
                                            >
                                                <Checkbox
                                                    id={`bank-${bank.id}`}
                                                    checked={form.bank_information.includes(
                                                        bank.id
                                                    )}
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
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
