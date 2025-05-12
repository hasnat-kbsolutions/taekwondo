// resources/js/Pages/Users/Index.tsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface Role {
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface Props {
    users: User[];
}

const columns: ColumnDef<User>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Email",
        accessorKey: "email",
    },
    {
        header: "Role",
        cell: ({ row }) => row.original.roles.map((r) => r.name).join(", "),
    },
    {
        header: "Actions",
        cell: ({ row }) => (
            <Link href={route("users.edit", row.original.id)}>
                <Button size="sm">Edit</Button>
            </Link>
        ),
    },
];

export default function Index({ users }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Link href={route("users.create")}>
                        {" "}
                        <Button>Add User</Button>{" "}
                    </Link>
                </div>
                <Card>
                    <DataTable columns={columns} data={users} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
