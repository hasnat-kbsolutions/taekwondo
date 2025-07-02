import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
interface User {
    id: number;
    name: string;
    email: string;
}

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
    city?: string;
    country?: string;
    phone?: string;
    tax_number?: string;
    invoice_prefix?: string;
    status: boolean;
    organization: Organization;
    user?: User;
}

interface Props {
    clubs: Club[];
}

const columns: ColumnDef<Club>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "User Name",
        cell: ({ row }) => row.original.user?.name ?? "-",
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
        header: "Phone",
        accessorKey: "phone",
    },
    {
        header: "Tax No.",
        accessorKey: "tax_number",
    },
    {
        header: "Invoice Prefix",
        accessorKey: "invoice_prefix",
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
        cell: ({ row }) => (
            <Badge variant={row.original.status ? "default" : "destructive"}>
                {row.original.status ? "Active" : "Inactive"}
            </Badge>
        ),
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
                        <Link href={route("admin.clubs.edit", row.original.id)}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("admin.clubs.destroy", row.original.id)}
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

export default function ClubIndex({ clubs }: Props) {
    return (
        <AuthenticatedLayout header="Cawangan">
            <Head title="Clubs" />
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Clubs</h1>
                    <Link href={route("admin.clubs.create")}>
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
