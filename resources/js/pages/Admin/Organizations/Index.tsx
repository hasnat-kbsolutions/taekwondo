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
        header: "Website",
        accessorKey: "website",
        cell: ({ row }) =>
            row.original.website ? (
                <a
                    href={row.original.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    {row.original.website}
                </a>
            ) : (
                "-"
            ),
    },
  
    {
        header: "Students",
        cell: ({ row }) => (
            <Link
                href={route("admin.students.index", {
                    organization_id: row.original.id,
                })}
            >
                {row.original.students?.length ?? 0}
            </Link>
        ),
    },
    {
        header: "Supporters",
        cell: ({ row }) => (
            <Link
                href={route("admin.supporters.index", {
                    organization_id: row.original.id,
                })}
            >
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
            <Link href={route("admin.organizations.edit", row.original.id)}>
                <Button size="sm">Edit</Button>
            </Link>
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
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Organizations</h1>
                    <Link href={route("admin.organizations.create")}>
                        <Button>Add Organization</Button>
                    </Link>
                </div>
                <DataTable data={organizations} columns={columns} />
            </div>
        </AuthenticatedLayout>
    );
}
