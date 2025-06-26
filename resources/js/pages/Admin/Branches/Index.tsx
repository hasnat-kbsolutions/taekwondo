import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface User {
    id: number;
    email: string;
}

interface Organization {
    id: number;
    name: string;
}

interface Branch {
    id: number;
    name: string;
    city?: string;
    status: boolean;
    organization: Organization;
    user?: User;
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
        header: "City",
        accessorKey: "city",
    },
    {
        header: "Organization",
        cell: ({ row }) => row.original.organization?.name ?? "-",
    },
    {
        header: "Email",
        cell: ({ row }) => row.original.user?.email ?? "-",
    },
    {
        header: "Status",
        cell: ({ row }) => (row.original.status ? "Active" : "Inactive"),
    },
    {
        header: "Actions",
        cell: ({ row }) => (
            <Link href={route("admin.branches.edit", row.original.id)}>
                <Button size="sm">Edit</Button>
            </Link>
        ),
    },
];

export default function BranchIndex({ branches }: Props) {
    return (
        <AuthenticatedLayout header="Cawangan">
            <Head title="Branches" />
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Branches</h1>
                    <Link href={route("admin.branches.create")}>
                        <Button>Add Branch</Button>
                    </Link>
                </div>
                <Card>
                    <DataTable columns={columns} data={branches} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
