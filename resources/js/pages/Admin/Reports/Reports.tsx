import React, { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

interface OrganizationReport {
    id: number;
    name: string;
    clubs_count: number;
    students_count: number;
    instructors_count: number;
    revenue: number;
    unpaid: number;
}

interface Props {
    organizations: OrganizationReport[];
}

export default function Reports({ organizations }: Props) {
    const [search, setSearch] = useState("");
    const filtered = useMemo(() => {
        return organizations.filter((org) =>
            org.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [organizations, search]);

    const columns: ColumnDef<OrganizationReport>[] = [
        {
            id: "serial",
            header: "#",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "name",
            header: "Organization",
            cell: ({ row }) => <span>{row.original.name}</span>,
        },
        {
            accessorKey: "clubs_count",
            header: "Clubs",
            cell: ({ row }) => (
                <Link href={route("admin.clubs.index", { organization_id: row.original.id })}>
                    <Eye className="inline h-4 w-4 mr-1 align-text-bottom" />
                    {row.original.clubs_count}
                </Link>
            ),
        },
        {
            accessorKey: "students_count",
            header: "Students",
            cell: ({ row }) => (
                <Link href={route("admin.students.index", { organization_id: row.original.id })}>
                    <Eye className="inline h-4 w-4 mr-1 align-text-bottom" />
                    {row.original.students_count}
                </Link>
            ),
        },
        {
            accessorKey: "instructors_count",
            header: "Instructors",
            cell: ({ row }) => (
                <Link href={route("admin.instructors.index", { organization_id: row.original.id })}>
                    <Eye className="inline h-4 w-4 mr-1 align-text-bottom" />
                    {row.original.instructors_count}
                </Link>
            ),
        },
        {
            accessorKey: "revenue",
            header: "Total Revenue",
            cell: ({ row }) => (
                <span>
                    {row.original.revenue.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                </span>
            ),
        },
        {
            accessorKey: "unpaid",
            header: "Unpaid Fees",
            cell: ({ row }) => (
                <span>
                    {row.original.unpaid.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout header="Reports">
            <Head title="Reports" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex justify-end">
                            <Input
                                type="text"
                                placeholder="Search organizations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64"
                            />
                        </div>
                        <DataTable
                            columns={columns}
                            data={filtered}
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
} 
