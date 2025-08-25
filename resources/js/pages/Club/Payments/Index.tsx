import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    FileText,
    DollarSign,
    BadgeCheck,
    Hourglass,
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Student {
    id: number;
    name: string;
}

interface Payment {
    id: number;
    student: Student;
    amount: number;
    status: string;
    method: string;
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
    payments: Payment[];
    filters: {
        status?: string;
        payment_month?: string;
    };
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

const columns: ColumnDef<Payment>[] = [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        header: "Student",
        cell: ({ row }) => row.original.student?.name || "-",
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
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.status === "paid" ||
                    row.original.status === "success"
                        ? "default"
                        : "destructive"
                }
            >
                {row.original.status}
            </Badge>
        ),
    },
    { header: "Method", accessorKey: "method" },
    { header: "Payment Month", accessorKey: "payment_month" },
    { header: "Pay At", accessorKey: "pay_at" },
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
                            href={route("club.payments.edit", row.original.id)}
                        >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "club.payments.destroy",
                                row.original.id
                            )}
                            method="delete"
                            as="button"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("club.payments.invoice", {
                                payment: row.original.id,
                            })}
                        >
                            <FileText className="w-4 h-4 mr-2" /> Invoice
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const currentYear = new Date().getFullYear();
const years = [
    "All",
    ...Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()),
];

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

export default function PaymentIndex({
    payments,
    filters,
    totalPayments,
    paidPayments,
    pendingPayments,
    amountsByCurrency,
    defaultCurrencyCode,
}: Props) {
    const [status, setStatus] = useState(filters.status || "");

    const [selectedYear, setSelectedYear] = useState(
        filters.payment_month?.split("-")[0] || currentYear.toString()
    );
    const [selectedMonth, setSelectedMonth] = useState(
        filters.payment_month?.split("-")[1] || ""
    );

    const handleFilterChange = ({
        year,
        month,
        status,
    }: {
        year: string;
        month: string;
        status: string;
    }) => {
        const paymentMonth =
            year === "All" ? "" : month ? `${year}-${month}` : `${year}-01`; // Default to January if no month

        router.get(
            route("club.payments.index"),
            {
                status: status || null,
                payment_month: paymentMonth || null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            return;
        }

        handleFilterChange({
            year: selectedYear,
            month: selectedMonth,
            status: status,
        });
    }, [selectedYear, selectedMonth, status]);

    const resetFilters = () => {
        setStatus("");
        setSelectedYear(currentYear.toString());
        setSelectedMonth("");
        router.get(
            route("club.payments.index"),
            {},
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout header="Payments">
            <Head title="Payments" />
            <div className="container mx-auto py-10 space-y-6">
                {/* Filters Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
                            {/* Year Filter */}
                            <div className="flex flex-col w-[160px]">
                                <Label className="text-sm mb-1">Year</Label>
                                <Select
                                    value={selectedYear}
                                    onValueChange={(value) => {
                                        setSelectedYear(value);
                                        if (value === "All")
                                            setSelectedMonth(""); // Clear month if "All" is selected
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Month Filter */}
                            <div className="flex flex-col w-[160px]">
                                <Label className="text-sm mb-1">Month</Label>
                                <Select
                                    value={selectedMonth}
                                    onValueChange={(val) =>
                                        setSelectedMonth(
                                            val === "all" ? "" : val
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
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
                            </div>

                            {/* Status Filter */}
                            <div className="flex flex-col w-[160px]">
                                <Label className="text-sm mb-1">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={(val) =>
                                        setStatus(val === "all" ? "" : val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="paid">
                                            Paid
                                        </SelectItem>
                                        <SelectItem value="unpaid">
                                            Unpaid
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reset Button */}
                            <div className="flex items-end">
                                <Button
                                    className="flex flex-wrap items-center gap-2 md:flex-row bg-primary text-background"
                                    onClick={resetFilters}
                                >
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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Payments</CardTitle>
                        <Link href={route("club.payments.create")}>
                            <Button>Add Payment</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={payments} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
