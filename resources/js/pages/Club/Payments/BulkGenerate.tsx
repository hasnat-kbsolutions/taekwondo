import React, { useState, useEffect } from "react";
import { Head, router, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
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
import { route } from "ziggy-js";

interface StudentWithPlan {
    student_id: number;
    student_name: string;
    effective_amount: number;
    currency_code: string;
}

interface Props {
    studentsWithPlans: StudentWithPlan[];
    month?: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear - i).toString()
);

const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
];

export default function BulkGenerate() {
    const {
        studentsWithPlans: initialStudents = [],
        month: initialMonth = "",
        errors = {},
    } = usePage().props as any;

    // Parse initial month into year and month
    const parseMonth = (monthStr: string) => {
        if (monthStr && monthStr.match(/^\d{4}-\d{2}$/)) {
            const [year, month] = monthStr.split("-");
            return { year, month };
        }
        return { year: "", month: "" };
    };

    const initialParsed = parseMonth(initialMonth);

    const [form, setForm] = useState({
        year: initialParsed.year,
        month: initialParsed.month,
    });

    const [studentsWithPlans, setStudentsWithPlans] =
        useState<StudentWithPlan[]>(initialStudents);
    const [isLoading, setIsLoading] = useState(false);

    // Sync students with props when they change (e.g., after filtering)
    useEffect(() => {
        setStudentsWithPlans(initialStudents);
    }, [initialStudents]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: value };

            // When year or month changes, combine them and reload the filtered list
            const monthStr =
                updated.year && updated.month
                    ? `${updated.year}-${updated.month}`
                    : "";

            if (monthStr) {
                setIsLoading(true);
                router.get(
                    route("club.payments.bulk-generate"),
                    { month: monthStr },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: () => {
                            setIsLoading(false);
                        },
                        onError: () => {
                            setIsLoading(false);
                        },
                    }
                );
            } else {
                // If month is cleared, clear students list (no reload needed)
                setStudentsWithPlans([]);
            }

            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Combine year and month into YYYY-MM format
        const monthStr =
            form.year && form.month ? `${form.year}-${form.month}` : "";
        router.post(route("club.payments.bulk-generate.store"), {
            month: monthStr,
        });
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    // Group students by currency for summary
    const summaryByCurrency = studentsWithPlans.reduce((acc, student) => {
        const code = student.currency_code || "MYR";
        if (!acc[code]) {
            acc[code] = { count: 0, total: 0 };
        }
        acc[code].count++;
        acc[code].total += student.effective_amount;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return (
        <AuthenticatedLayout header="Bulk Generate Payments">
            <Head title="Bulk Generate Payments" />
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        Generate Payments for All Students
                    </h2>
                    <Link href={route("club.payments.index")}>
                        <Button variant="outline">Back to Payments</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Bulk Payment Generation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 max-w-md">
                                {/* Year Selection */}
                                <div>
                                    <Label htmlFor="year">
                                        Year{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.year}
                                        onValueChange={(value) =>
                                            handleChange("year", value)
                                        }
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map((year) => (
                                                <SelectItem
                                                    key={year}
                                                    value={year}
                                                >
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError("year")}
                                </div>

                                {/* Month Selection */}
                                <div>
                                    <Label htmlFor="month">
                                        Month{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.month}
                                        onValueChange={(value) =>
                                            handleChange("month", value)
                                        }
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month) => (
                                                <SelectItem
                                                    key={month.value}
                                                    value={month.value}
                                                >
                                                    {month.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError("month")}
                                </div>
                            </div>
                            {isLoading && (
                                <p className="text-sm text-blue-500">
                                    Loading filtered students...
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                                Select the year and month for which payments
                                will be generated. Students who already have
                                payments for this month will be excluded. Due
                                date will be set to the end of the selected
                                month.
                            </p>

                            {/* Summary Card */}
                            {studentsWithPlans.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Preview: {studentsWithPlans.length}{" "}
                                            Student(s) will receive payments
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Summary by Currency */}
                                            <div>
                                                <h4 className="font-semibold mb-2">
                                                    Summary by Currency:
                                                </h4>
                                                <div className="space-y-1">
                                                    {Object.entries(
                                                        summaryByCurrency
                                                    ).map(
                                                        ([currency, data]) => (
                                                            <div
                                                                key={currency}
                                                                className="flex justify-between text-sm"
                                                            >
                                                                <span>
                                                                    {currency}:{" "}
                                                                    {data.count}{" "}
                                                                    payment(s)
                                                                </span>
                                                                <span className="font-medium">
                                                                    {currency}{" "}
                                                                    {data.total.toFixed(
                                                                        2
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Student List */}
                                            <div>
                                                <h4 className="font-semibold mb-2">
                                                    Students:
                                                </h4>
                                                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                                                    <div className="space-y-1">
                                                        {studentsWithPlans.map(
                                                            (student) => (
                                                                <div
                                                                    key={
                                                                        student.student_id
                                                                    }
                                                                    className="flex justify-between text-sm py-1 border-b last:border-b-0"
                                                                >
                                                                    <span>
                                                                        {
                                                                            student.student_name
                                                                        }
                                                                    </span>
                                                                    <span className="font-medium">
                                                                        {
                                                                            student.currency_code
                                                                        }{" "}
                                                                        {student.effective_amount.toFixed(
                                                                            2
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {!form.year || !form.month ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-muted-foreground text-center">
                                            Please select both year and month to
                                            see students who will receive
                                            payments.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : studentsWithPlans.length === 0 ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-muted-foreground text-center">
                                            No students with active fee plans
                                            found for this month, or all
                                            students already have payments for
                                            this month. Please assign fee plans
                                            to students first.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : null}

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-4">
                                <Link href={route("club.payments.index")}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={
                                        studentsWithPlans.length === 0 ||
                                        !form.year ||
                                        !form.month ||
                                        isLoading
                                    }
                                >
                                    Generate Payments
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
