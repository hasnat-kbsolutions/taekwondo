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

interface Payment {
    id: number;
    student_id: number;
    notes: string;
    amount: string;
    status: "paid" | "unpaid";
    method: "cash" | "stripe";
    pay_at: string;
    payment_month: string;
}

interface Student {
    id: number;
    name: string;
}

interface Props {
    payment: Payment;
    students: Student[];
}

export default function Edit({ payment, students }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: payment.student_id || "",
        notes: payment.notes || "",
        amount: payment.amount || "",
        status: payment.status || "unpaid",
        method: payment.method || "cash",
        pay_at: payment.pay_at || "",
        payment_month: payment.payment_month || "",
    });

    const handleChange = (field: keyof typeof data, value: string) => {
        setData(field, value);
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
                            <div className="grid grid-cols-3 gap-4">
                                {/* Student */}
                                <div>
                                    <Label>
                                        Student
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.student_id.toString()}
                                        onValueChange={(value) =>
                                            handleChange("student_id", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
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
                                    {renderError("student_id")}
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
                                            <SelectItem value="stripe">
                                                Stripe
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {renderError("method")}
                                </div>

                                {/* Payment Month */}
                                <div>
                                    <Label>
                                        Payment Month
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="month"
                                        value={data.payment_month}
                                        onChange={(e) =>
                                            handleChange(
                                                "payment_month",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {renderError("payment_month")}
                                </div>

                                {/* Pay At */}
                                <div>
                                    <Label>
                                        Pay At
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.pay_at}
                                        onChange={(e) =>
                                            handleChange(
                                                "pay_at",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {renderError("pay_at")}
                                </div>

                                {/* Notes */}
                                <div className="col-span-3">
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
