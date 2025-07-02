import React, { useState } from "react";
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
import { MoreHorizontal } from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

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
}

interface Props {
    payments: Payment[];
    filters: {
        status?: string;
        payment_month?: string;
    };
}

const columns: ColumnDef<Payment>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Student",
        cell: ({ row }) => row.original.student?.name || "-",
    },
    {
        header: "Amount",
        accessorKey: "amount",
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
    {
        header: "Method",
        accessorKey: "method",
    },
    {
        header: "Payment Month",
        accessorKey: "payment_month",
    },
    {
        header: "Pay At",
        accessorKey: "pay_at",
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
                            href={route("admin.payments.edit", row.original.id)}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "admin.payments.destroy",
                                row.original.id
                            )}
                            method="delete"
                            as="button"
                        >
                            Delete
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function PaymentIndex({ payments, filters }: Props) {
    const [status, setStatus] = useState(filters.status || "all");
    const [month, setMonth] = useState(filters.payment_month || "");

    const applyFilters = () => {
        router.get(
            route("admin.payments.index"),
            {
                status: status !== "all" ? status : "",
                payment_month: month,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setStatus("all");
        setMonth("");
        router.get(
            route("admin.payments.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout header="Payments">
            <Head title="Payments" />
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Payments</h1>
                    <Link href={route("admin.payments.create")}>
                        <Button>Add Payment</Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="w-48">
                        <label className="block text-sm font-medium mb-1">
                            Status
                        </label>
                        <Select
                            value={status}
                            onValueChange={(value) => setStatus(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-48">
                        <label className="block text-sm font-medium mb-1">
                            Payment Month
                        </label>
                        <input
                            type="month"
                            className="w-full border rounded px-3 py-2 text-sm"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={applyFilters}>Apply</Button>
                        <Button variant="outline" onClick={resetFilters}>
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <DataTable data={payments} columns={columns} />
            </div>
        </AuthenticatedLayout>
    );
}
