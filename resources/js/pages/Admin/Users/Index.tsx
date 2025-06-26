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
    role: string;
}

interface Props {
    users: {
        [key: string]: User[]; // grouped by role
    };
}

const columns: ColumnDef<User>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
        header: "Actions",
        cell: ({ row }) => (
            <Link href={route("admin.users.edit", row.original.id)}>
                <Button size="sm">Edit</Button>
            </Link>
        ),
    },
];

export default function Index({ users }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Link href={route("admin.users.create")}>
                        <Button>Add User</Button>
                    </Link>
                </div>

                {Object.entries(users).map(([role, userList]) => (
                    <div key={role} className="space-y-2">
                        <h2 className="text-xl font-semibold capitalize">
                            {role}s
                        </h2>
                        <Card>
                            <DataTable columns={columns} data={userList} />
                        </Card>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
