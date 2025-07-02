import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Club {
    id: number;
    name: string;
    city?: string;
    status: boolean;
    user?: User;
    phone?: string;
    skype?: string;
    tax_number?: string;
    invoice_prefix?: string;
    notification_emails?: string;
    website?: string;
    postal_code?: string;
}

interface Props {
    clubs: Club[];
}

const columns: ColumnDef<Club>[] = [
    { header: "ID", accessorKey: "id" },
    {
        header: "User Name",
        cell: ({ row }) => row.original.user?.name ?? "-",
    },
    { header: "Email", cell: ({ row }) => row.original.user?.email ?? "-" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Skype", accessorKey: "skype" },
    { header: "Tax Number", accessorKey: "tax_number" },
    { header: "Invoice Prefix", accessorKey: "invoice_prefix" },
    { header: "City", accessorKey: "city" },
    { header: "Postal Code", accessorKey: "postal_code" },
    { header: "Website", accessorKey: "website" },
    {
        header: "Notification Emails",
        cell: ({ row }) => row.original.notification_emails || "-",
    },
    {
        header: "Status",
        cell: ({ row }) => (row.original.status ? "Active" : "Inactive"),
    },
    {
        header: "Actions",
        cell: ({ row }) => (
            <Link href={route("organization.clubs.edit", row.original.id)}>
                <Button size="sm">Edit</Button>
            </Link>
        ),
    },
];

export default function ClubIndex({ clubs }: Props) {
    return (
        <AuthenticatedLayout header="Cawangan">
            <Head title="Clubs" />
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Clubs</h1>
                    <Link href={route("organization.clubs.create")}>
                        <Button>Add Club</Button>
                    </Link>
                </div>
                <Card>
                    <DataTable columns={columns} data={clubs} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
