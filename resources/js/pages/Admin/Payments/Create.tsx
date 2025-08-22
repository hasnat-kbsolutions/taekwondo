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

export default function Create() {
    const { students, currencies, errors } = usePage().props as any;

    const [form, setForm] = useState({
        student_id: "",
        amount: "",
        currency_code: "MYR",
        status: "paid",
        method: "cash",
        pay_at: "",
        payment_month: "",
        notes: "",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
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
                                        Student
                                        <span className="text-red-500">*</span>
                                    </Label>
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
                                    {renderError("student_id")}
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
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="unpaid">
                                                Unpaid
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
                                            <SelectItem value="stripe">
                                                Stripe
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {renderError("method")}
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
                                                        {
                                                            month: "long",
                                                        }
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError("payment_month")}
                                </div>

                                <div>
                                    <Label>
                                        Pay At
                                        <span className="text-red-500">*</span>
                                    </Label>
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
