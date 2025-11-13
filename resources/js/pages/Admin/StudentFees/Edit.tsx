import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Student {
    id: number;
    name: string;
    surname?: string;
}

interface FeeType {
    id: number;
    name: string;
}

interface StudentFee {
    id: number;
    student_id: number;
    fee_type_id: number;
    month: string;
    amount: number;
    discount: number;
    fine: number;
    due_date: string | null;
}

interface Props {
    studentFee: StudentFee;
    students: Student[];
    feeTypes: FeeType[];
}

export default function Edit({
    studentFee,
    students = [],
    feeTypes = [],
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: studentFee.student_id.toString(),
        fee_type_id: studentFee.fee_type_id.toString(),
        month: studentFee.month,
        amount: studentFee.amount.toString(),
        discount: studentFee.discount.toString(),
        fine: studentFee.fine.toString(),
        due_date: studentFee.due_date || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.student-fees.update", studentFee.id));
    };

    return (
        <AuthenticatedLayout header="Edit Student Fee">
            <Head title="Edit Student Fee" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Student Fee</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>
                                        Student{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={
                                            data.student_id
                                                ? String(data.student_id)
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            setData("student_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem
                                                    key={student.id}
                                                    value={String(student.id)}
                                                >
                                                    {student.name}{" "}
                                                    {student.surname || ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.student_id && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.student_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>
                                        Fee Type{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={
                                            data.fee_type_id
                                                ? String(data.fee_type_id)
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            setData("fee_type_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Fee Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {feeTypes.map((feeType) => (
                                                <SelectItem
                                                    key={feeType.id}
                                                    value={String(feeType.id)}
                                                >
                                                    {feeType.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.fee_type_id && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.fee_type_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>
                                        Month (YYYY-MM){" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <input
                                        type="month"
                                        value={data.month}
                                        onChange={(e) =>
                                            setData("month", e.target.value)
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.month && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.month}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>
                                        Amount{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData("amount", e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                    {errors.amount && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Discount</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.discount}
                                        onChange={(e) =>
                                            setData("discount", e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                    {errors.discount && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.discount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Fine</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.fine}
                                        onChange={(e) =>
                                            setData("fine", e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                    {errors.fine && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.fine}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Due Date</Label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData("due_date", e.target.value)
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.due_date && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.due_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Update Student Fee
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
