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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.payments.update", payment.id));
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
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {/* Student */}
                            <div className="col-span-1">
                                <Label>Student</Label>
                                <Select
                                    value={String(data.student_id)}
                                    onValueChange={(value) =>
                                        setData("student_id", parseInt(value))
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
                            <div className="col-span-1">
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

                            {/* Status */}
                            <div className="col-span-1">
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
                            <div className="col-span-1">
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
                            <div className="col-span-1">
                                <Label>Payment Month</Label>
                                <Input
                                    type="month"
                                    value={data.payment_month}
                                    onChange={(e) =>
                                        setData("payment_month", e.target.value)
                                    }
                                />
                                {errors.payment_month && (
                                    <p className="text-red-500 text-sm">
                                        {errors.payment_month}
                                    </p>
                                )}
                            </div>

                            {/* Pay At */}
                            <div className="col-span-1">
                                <Label>Pay At</Label>
                                <Input
                                    type="date"
                                    value={data.pay_at}
                                    onChange={(e) =>
                                        setData("pay_at", e.target.value)
                                    }
                                />
                                {errors.pay_at && (
                                    <p className="text-red-500 text-sm">
                                        {errors.pay_at}
                                    </p>
                                )}
                            </div>

                            {/* Notes (full width) */}
                            <div className="col-span-full">
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

                            {/* Submit Button */}
                            <div className="col-span-full">
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
