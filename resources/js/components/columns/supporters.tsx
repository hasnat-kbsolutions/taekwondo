import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export type Supporter = {
    id: number;
    club_id: number;
    country?: string;
    organization_id: number;
    name: string;
    surename: string;
    gender: string;
    email?: string;
    phone?: string;
    type: string;
    status: boolean;
    profile_image: string | null; 
};
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal } from "lucide-react";

export const columns = (
    onView: (supporter: Supporter) => void
): ColumnDef<Supporter>[] => [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "surename", header: "Surename" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "type", header: "Type" },
    // { accessorKey: "status", header: "Status" },

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const supporter = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(supporter)}>
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.supporters.edit",
                                    supporter.id
                                )}
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.supporters.destroy",
                                    supporter.id
                                )}
                                method="delete"
                                as="button"
                            >
                                Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
