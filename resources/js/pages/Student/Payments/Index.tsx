import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 31 }, (_, i) => currentYear - 15 + i); // [currentYear -15, ..., currentYear +15]

interface Payment {
    id: number;
    amount: number;
    method: string;
    status: string;
    payment_month: string;
    pay_at: string;
    notes?: string;
}

interface Props {
    attendance: Record<string, "present" | "absent">;
    year: number;
    payments: Payment[];
}

export default function Payment({ attendance, year, payments }: Props) {
    const [selectedYear, setSelectedYear] = useState(year || currentYear);

    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);
        router.get(route("student.payments.index"), { year: newYear });
    };

    const resetFilters = () => {
        setSelectedYear(currentYear);
        router.get(route("student.payments.index"), { year: currentYear });
    };

    const columns: ColumnDef<Payment>[] = [
        {
            header: "#",
            cell: ({ row }) => row.index + 1,
        },
        {
            header: "Amount",
            cell: ({ row }) => `Rs. ${row.original.amount.toFixed(2)}`,
        },
        {
            header: "Method",
            accessorKey: "method",
        },
        {
            header: "Status",
            cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.original.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {row.original.status}
                </span>
            ),
        },
        {
            header: "Payment Month",
            accessorKey: "payment_month",
        },
        {
            header: "Pay At",
            cell: ({ row }) =>
                row.original.pay_at
                    ? format(new Date(row.original.pay_at), "MMM dd, yyyy")
                    : "-",
        },
        {
            header: "Notes",
            cell: ({ row }) => row.original.notes || "-",
        },
    ];

    return (
        <AuthenticatedLayout header="My Payments">
            <Head title="My Payments" />

            <div className="container mx-auto py-10 space-y-6">
                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
                            <div className="flex flex-col w-[180px]">
                                <Label className="text-sm mb-1">Year</Label>
                                <Select
                                    onValueChange={handleYearChange}
                                    value={selectedYear.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button onClick={resetFilters}>
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={payments} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
