import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router, Link } from "@inertiajs/react";
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
import {
    Coins,
    BadgeCheck,
    Hourglass,
    DollarSign,
    FileText,
    Download,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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
    currency_code?: string;
    currency?: {
        code: string;
        symbol: string;
    };
}

interface Props {
    year: number;
    payments: Payment[];
    totalPayments?: number;
    paidPayments?: number;
    pendingPayments?: number;
    amountsByCurrency?: Record<string, number>;
    defaultCurrencyCode?: string;
}

// Utility function to safely format amounts
const formatAmount = (amount: any, currencyCode: string = "MYR") => {
    const numAmount = Number(amount) || 0;
    if (currencyCode === "JPY") {
        return numAmount.toLocaleString();
    } else {
        return numAmount.toFixed(2);
    }
};

export default function Payment({
    year,
    payments,
    totalPayments,
    paidPayments,
    pendingPayments,
    amountsByCurrency,
    defaultCurrencyCode,
}: Props) {
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
            cell: ({ row }) => {
                const currencySymbol = row.original.currency?.symbol || "RM";
                const currencyCode = row.original.currency_code || "MYR";
                return `${currencySymbol} ${formatAmount(
                    row.original.amount,
                    currencyCode
                )}`;
            },
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
        {
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link
                                href={route("student.payments.invoice", {
                                    payment: row.original.id,
                                })}
                            >
                                <FileText className="w-4 h-4 mr-2" /> View
                                Invoice
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route("student.payments.invoice", {
                                    payment: row.original.id,
                                })}
                            >
                                <Download className="w-4 h-4 mr-2" /> Download
                                Invoice
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Payments
                            </CardTitle>
                            <DollarSign className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalPayments || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Paid
                            </CardTitle>
                            <BadgeCheck className="h-6 w-6 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {paidPayments || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Hourglass className="h-6 w-6 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">
                                {pendingPayments || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 w-full">
                                <div className="text-lg font-bold">
                                    {defaultCurrencyCode === "MYR"
                                        ? "RM"
                                        : defaultCurrencyCode}{" "}
                                    {formatAmount(
                                        amountsByCurrency?.[
                                            defaultCurrencyCode || "MYR"
                                        ] || 0,
                                        defaultCurrencyCode || "MYR"
                                    )}
                                </div>
                                {amountsByCurrency &&
                                    Object.keys(amountsByCurrency).length >
                                        1 && (
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            {Object.entries(amountsByCurrency)
                                                .filter(
                                                    ([code]) =>
                                                        code !==
                                                        defaultCurrencyCode
                                                )
                                                .map(([code, amount]) => (
                                                    <div
                                                        key={code}
                                                        className="flex justify-between"
                                                    >
                                                        <span>{code}:</span>
                                                        <span>
                                                            {formatAmount(
                                                                amount,
                                                                code
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
