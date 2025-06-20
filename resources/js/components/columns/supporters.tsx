import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export type Supporter = {
    id: number;
    branch_id: number;
    country?: string;
    organization_id: number;
    club_id: number;
    name: string;
    surename: string;
    gender: string;
    email?: string;
    phone?: string;
    type: string;
    status: boolean;
};

export const columns: ColumnDef<Supporter>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "surename", header: "Surename" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "status", header: "Status" },

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <Link href={route("supporters.edit", row.original.id)}>
                    <Button variant="outline" size="sm">
                        Edit
                    </Button>
                </Link>
                <Link
                    href={route("supporters.destroy", row.original.id)}
                    method="delete"
                    as="button"
                >
                    <Button variant="destructive" size="sm">
                        Delete
                    </Button>
                </Link>
            </div>
        ),
    },
];
