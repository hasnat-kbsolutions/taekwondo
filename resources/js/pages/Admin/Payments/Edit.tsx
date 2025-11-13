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
    student_fee_id: number;
    notes: string;
    amount: string;
    status: "pending" | "successful" | "failed";
    method: "cash" | "card" | "stripe";
    pay_at: string;
    transaction_id?: string;
    currency_code: string;
    bank_information?: any[];
    student_fee?: {
        id: number;
        student: {
            id: number;
            name: string;
            surname?: string;
        };
        fee_type: {
            id: number;
            name: string;
        };
        month: string;
    };
}

interface StudentFee {
    id: number;
    student: {
        id: number;
        name: string;
        surname?: string;
    };
    fee_type: {
        id: number;
        name: string;
    };
    month: string;
    status: string;
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
    studentFees: StudentFee[];
    bank_information: BankInformation[];
    currencies: Currency[];
}

export default function Edit({
    payment,
    studentFees = [],
    bank_information = [],
    currencies = [],
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_fee_id: payment.student_fee_id || "",
        notes: payment.notes || "",
        amount: payment.amount || "",
        status: payment.status || "pending",
        method: payment.method || "cash",
        pay_at: payment.pay_at || "",
        transaction_id: payment.transaction_id || "",
        currency_code: payment.currency_code || "MYR",
        bank_information:
            payment.bank_information?.map((bank: any) => bank.id) || [],
    });

    const handleChange = (field: keyof typeof data, value: string) => {
        setData(field, value);
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
        put(route("admin.payments.update", payment.id));
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
                                {/* Student Fee */}
                                <div>
                                    <Label>
                                        Student Fee
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.student_fee_id.toString()}
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
                                            studentFees.length > 0 ? (
                                                studentFees.map((sf) => (
                                                    <SelectItem
                                                        key={sf.id}
                                                        value={String(sf.id)}
                                                    >
                                                        {sf.student?.name}{" "}
                                                        {sf.student?.surname} -{" "}
                                                        {sf.fee_type?.name} (
                                                        {sf.month})
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    No student fees available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {renderError("student_fee_id")}
                                </div>

                                {/* Amount */}
                                <div>
                                    <Label>
                                        Amount
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) =>
                                            handleChange(
                                                "amount",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {renderError("amount")}
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
                                            handleChange("currency_code", value)
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
                                    {renderError("currency_code")}
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

                                {/* Transaction ID */}
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

                                {/* Pay At */}
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

                                {/* Notes */}
                                <div className="col-span-2">
                                    <Label>Notes</Label>
                                    <Input
                                        value={data.notes}
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
