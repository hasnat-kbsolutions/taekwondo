import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface Club {
    id: number;
    name: string;
    // Add other fields you actually use
}

interface Student {
    id: number;
    name: string;
    // Add other fields you actually use
}

interface Supporter {
    id: number;
    name: string;
    // Add other fields you actually use
}

interface Organization {
    id: number;
    name: string;
    status: boolean;
    clubs: Club[];
    students: Student[];
    supporters: Supporter[];
}

interface Props {
    organizations: Organization[];
    club: number;
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
        header: "Clubs",
        cell: ({ row }) => (
            <Link
                href={route("clubs.index", {
                    organization_id: row.original.id,
                })}
            >
                {row.original.clubs?.length ?? 0}
            </Link>
        ),
    },
    {
        header: "Students",
        cell: ({ row }) => (
            <Link
                href={route("students.index", {
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
                href={route("supporters.index", {
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
            <Link href={route("organizations.edit", row.original.id)}>
                <Button size="sm">Edit</Button>
            </Link>
        ),
    },
];

export default function OrganizationIndex({
    organizations,
    club,
    student,
    supporter,
}: Props) {
    return (
        <AuthenticatedLayout header="Ahli Gabungan">
            <Head title="Students" />
            <div className="p-4 space-y-6">
                <h1 className="text-2xl font-bold">Organizations</h1>

                <DataTable data={organizations} columns={columns} />
            </div>
        </AuthenticatedLayout>
    );
}
