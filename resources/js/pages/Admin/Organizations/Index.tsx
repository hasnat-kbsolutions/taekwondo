import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Student {
    id: number;
    name: string;
}

interface Supporter {
    id: number;
    name: string;
}

interface Organization {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    website?: string;
    status: boolean;
    students: Student[];
    supporters: Supporter[];
}

interface Props {
    organizations: Organization[];
    student: number;
    supporter: number;
}

const columns: ColumnDef<Organization>[] = [
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
        header: "Phone",
        accessorKey: "phone",
    },
    {
        header: "City",
        accessorKey: "city",
    },
    {
        header: "Country",
        accessorKey: "country",
    },

    {
        header: "Students",
        cell: ({ row }) => (
            <Link
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                href={route("admin.students.index", {
                    organization_id: row.original.id,
                })}
            >
                <Eye className="w-4 h-4" />
                {row.original.students?.length ?? 0}
            </Link>
        ),
    },
    {
        header: "Supporters",
        cell: ({ row }) => (
            <Link
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                href={route("admin.supporters.index", {
                    organization_id: row.original.id,
                })}
            >
                <Eye className="w-4 h-4" />
                {row.original.supporters?.length ?? 0}
            </Link>
        ),
    },

    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (row.original.status ? "Active" : "Inactive"),
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
                            href={route(
                                "admin.organizations.edit",
                                row.original.id
                            )}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "admin.organizations.destroy",
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

export default function OrganizationIndex({
    organizations,
    student,
    supporter,
}: Props) {
    return (
        <AuthenticatedLayout header="Ahli Gabungan">
            <Head title="Organizations" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Organizations</CardTitle>
                        <Link href={route("admin.organizations.create")}>
                            {" "}
                            <Button>Add Supporter</Button>{" "}
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={organizations} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
