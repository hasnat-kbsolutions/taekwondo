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
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

export const columns = (
    onView: (supporter: Supporter) => void
): ColumnDef<Supporter>[] => [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
        meta: {
            sticky: true,
            left: "0px",
            className:
                "border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[60px] w-[60px]",
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        meta: {
            sticky: true,
            left: "60px",
            className:
                "border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[150px]",
        },
    },
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
                            <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.supporters.edit",
                                    supporter.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
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
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
