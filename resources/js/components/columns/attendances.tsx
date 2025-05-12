import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export type Attendance = {
    id: number;
    name: string;
    company_id: number;
    organization_id: number;
    tax_number?: string;
    invoice_prefix: string;
    status: boolean;
    email?: string;
    phone?: string;
    website?: string;
};

export const columns: ColumnDef<Attendance>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Student",
        accessorKey: "student_id",
    },
    {
        header: "Date",
        accessorKey: "date",
    },
    {
        header: "Status",
        accessorKey: "status",
    },

    {
        header: "Actions",
        cell: ({ row }) => {
            const attendance = row.original;
            return (
                <div className="flex space-x-2">
                    <Link href={route("attendances.edit", attendance.id)}>
                        <Button size="sm" variant="outline">
                            Edit
                        </Button>
                    </Link>
                    <Link
                        as="button"
                        method="delete"
                        href={route("attendances.destroy", attendance.id)}
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
