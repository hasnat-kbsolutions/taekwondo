import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
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
        accessorKey: "status",
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
            <Link href={route("payments.edit", row.original.id)}>
                <Button size="sm">Edit</Button>
            </Link>
        ),
    },
];

export default function PaymentIndex({ payments }: Props) {
    return (
        <AuthenticatedLayout header="Payments">
            <Head title="Payments" />
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Payments</h1>
                    <Link href={route("payments.create")}>
                        <Button>Add Payment</Button>
                    </Link>
                </div>
                <DataTable data={payments} columns={columns} />
            </div>
        </AuthenticatedLayout>
    );
}
