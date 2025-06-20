import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";

interface Branch {
    id: number;
    name: string;
    country: string;
    city: string;
    street: string;
    postal_code: string;
    status: boolean;
}

interface Props {
    branches: Branch[];
}

const columns: ColumnDef<Branch>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Country",
        accessorKey: "country",
    },
    {
        header: "City",
        accessorKey: "city",
    },
    {
        header: "Street",
        accessorKey: "street",
    },
    {
        header: "Postal Code",
        accessorKey: "postal_code",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
            <span
                className={`text-sm font-semibold ${
                    row.original.status ? "text-green-600" : "text-gray-400"
                }`}
            >
                {row.original.status ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Link href={route("branches.edit", row.original.id)}>
                    <Button variant="secondary" size="sm">
                        Edit
                    </Button>
                </Link>
                <Link
                    href={route("branches.destroy", row.original.id)}
                    method="delete"
                    as="button"
                    className="text-red-600 text-sm"
                >
                    Delete
                </Link>
            </div>
        ),
    },
];

export default function Index({ branches }: Props) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Branches" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Branches</CardTitle>
                        <Link href={route("branches.create")}>
                            <Button>Add Branch</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={branches} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
