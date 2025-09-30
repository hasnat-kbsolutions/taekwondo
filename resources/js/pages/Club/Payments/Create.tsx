import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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
import { Checkbox } from "@/components/ui/checkbox";

export default function Create() {
    const { students, currencies, defaultCurrency, bank_information } =
        usePage().props as any;

    const [form, setForm] = useState({
        student_id: "",
        amount: "",
        currency_code: defaultCurrency || "MYR",
        status: "paid",
        method: "cash",
        pay_at: "",
        payment_month: "",
        notes: "",
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
        router.post(route("club.payments.store"), form);
    };

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
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Student</Label>
                                    <Select
                                        value={form.student_id}
                                        onValueChange={(value) =>
                                            handleChange("student_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((s: any) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={String(s.id)}
                                                >
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Amount</Label>
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
                                </div>
                                <div>
                                    <Label>Currency</Label>
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
                                </div>
                                <div>
                                    <Label>Status</Label>
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
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="unpaid">
                                                Unpaid
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Method</Label>
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
                                            <SelectItem value="stripe">
                                                Stripe
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>
                                        Month
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.payment_month}
                                        onValueChange={(value) =>
                                            handleChange("payment_month", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                "01",
                                                "02",
                                                "03",
                                                "04",
                                                "05",
                                                "06",
                                                "07",
                                                "08",
                                                "09",
                                                "10",
                                                "11",
                                                "12",
                                            ].map((m) => (
                                                <SelectItem key={m} value={m}>
                                                    {new Date(
                                                        0,
                                                        parseInt(m) - 1
                                                    ).toLocaleString(
                                                        "default",
                                                        { month: "long" }
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>
                                        Pay At
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
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
                                            </Button>
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
