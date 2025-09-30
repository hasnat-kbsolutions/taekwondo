import React from "react";
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
import { CalendarIcon } from "@radix-ui/react-icons";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Payment {
    id: number;
    student_id: number;
    notes: string;
    amount: string;
    status: "paid" | "unpaid";
    method: "cash" | "stripe";
    pay_at: string;
    payment_month: string;
    currency_code: string;
    bank_information?: any[];
}

interface Student {
    id: number;
    name: string;
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
    bank_information: BankInformation[];
    currencies: Currency[];
}

export default function Edit({
    payment,
    students,
    bank_information,
    currencies,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: payment.student_id || "",
        notes: payment.notes || "",
        amount: payment.amount || "",
        status: payment.status || "unpaid",
        method: payment.method || "cash",
        pay_at: payment.pay_at || "",
        payment_month:
            payment.payment_month.length === 2
                ? payment.payment_month
                : payment.payment_month.split("-")[1] || "",
        currency_code: payment.currency_code || "MYR",
        bank_information:
            payment.bank_information?.map((bank: any) => bank.id) || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("club.payments.update", payment.id));
    };

    const handleBankSelection = (bankId: number, checked: boolean) => {
        const currentBanks = data.bank_information as number[];
        const updatedBanks = checked
            ? [...currentBanks, bankId]
            : currentBanks.filter((id: number) => id !== bankId);
        setData("bank_information", updatedBanks);
    };

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
                                    <Label>Student</Label>
                                    <Select
                                        value={String(data.student_id)}
                                        onValueChange={(value) =>
                                            setData(
                                                "student_id",
                                                parseInt(value)
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((s) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={String(s.id)}
                                                >
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.student_id && (
                                        <p className="text-red-500 text-sm">
                                            {errors.student_id}
                                        </p>
                                    )}
                                </div>

                                {/* Amount */}
                                <div>
                                    <Label>Amount</Label>
                                    <Input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData("amount", e.target.value)
                                        }
                                    />
                                    {errors.amount && (
                                        <p className="text-red-500 text-sm">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                {/* Currency */}
                                <div>
                                    <Label>
                                        Currency
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.currency_code}
                                        onValueChange={(value) =>
                                            setData("currency_code", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((currency) => (
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
                                    {errors.currency_code && (
                                        <p className="text-red-500 text-sm">
                                            {errors.currency_code}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <Label>Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData(
                                                "status",
                                                value as "paid" | "unpaid"
                                            )
                                        }
                                    >
                                        <SelectTrigger>
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
                                    {errors.status && (
                                        <p className="text-red-500 text-sm">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                {/* Method */}
                                <div>
                                    <Label>Method</Label>
                                    <Select
                                        value={data.method}
                                        onValueChange={(value) =>
                                            setData(
                                                "method",
                                                value as "cash" | "stripe"
                                            )
                                        }
                                    >
                                        <SelectTrigger>
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
                                    {errors.method && (
                                        <p className="text-red-500 text-sm">
                                            {errors.method}
                                        </p>
                                    )}
                                </div>

                                {/* Payment Month */}
                                <div>
                                    <Label>
                                        Month
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.payment_month}
                                        onValueChange={(value) =>
                                            setData("payment_month", value)
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
                                    {errors.payment_month && (
                                        <p className="text-red-500 text-sm">
                                            {errors.payment_month}
                                        </p>
                                    )}
                                </div>

                                {/* Pay At */}
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
                                            </Button>
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
                                                    setData(
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
                                    {errors.pay_at && (
                                        <p className="text-red-500 text-sm">
                                            {errors.pay_at}
                                        </p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div className="col-span-2">
                                    <Label>Notes</Label>
                                    <Input
                                        type="text"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                    />
                                    {errors.notes && (
                                        <p className="text-red-500 text-sm">
                                            {errors.notes}
                                        </p>
                                    )}
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
                                {errors.bank_information && (
                                    <p className="text-red-500 text-sm">
                                        {errors.bank_information}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <Button type="submit" disabled={processing}>
                                    Update
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
