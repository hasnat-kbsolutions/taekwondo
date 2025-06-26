import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export type Club = {
    id: number;
    name: string;
    branch_id: number;
    organization_id: number;
    tax_number?: string;
    invoice_prefix: string;
    status: boolean;
    email?: string;
    phone?: string;
    website?: string;
};

export const columns: ColumnDef<Club>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Invoice Prefix",
        accessorKey: "invoice_prefix",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (row.original.status ? "Active" : "Inactive"),
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
        header: "Website",
        accessorKey: "website",
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            const club = row.original;
            return (
                <div className="flex space-x-2">
                    <Link href={route("admin.clubs.edit", club.id)}>
                        <Button size="sm" variant="outline">
                            Edit
                        </Button>
                    </Link>
                    <Link
                        as="button"
                        method="delete"
                        href={route("admin.clubs.destroy", club.id)}
                        onBefore={() => confirm("Are you sure?")}
                    >
                        <Button size="sm" variant="destructive">
                            Delete
                        </Button>
                    </Link>
                </div>
            );
        },
    },
];
