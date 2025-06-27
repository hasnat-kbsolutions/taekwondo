import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export type Student = {
    id: number;
    uid: string;
    code: string;
    name: string;
    surname: string;
    nationality: string;
    dob: string | null;
    dod: string | null;
    grade: string;
    gender: string;
    id_passport: string;
    profile_image: string | null;
    id_passport_image: string | null;
    signature_image: string | null;
    email: string;
    phone: string;
    skype: string;
    website: string;
    city: string;
    postal_code: string;
    street: string;
    country: string;
    status: boolean;
};

export const columns: ColumnDef<Student>[] = [
    { accessorKey: "id", header: "ID" },
    {
        id: "profile_image",
        header: "Photo",
        cell: ({ row }) =>
            row.original.profile_image ? (
                <img
                    src={row.original.profile_image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                />
            ) : (
                <span className="text-gray-400 italic">No image</span>
            ),
    },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "surname", header: "Surname" },
    { accessorKey: "dob", header: "DOB" },
    { accessorKey: "id_passport", header: "ID/Passport" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status ? "default" : "destructive"}>
                {row.original.status ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        id: "actions",
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
                            href={route("admin.students.edit", row.original.id)}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "admin.students.destroy",
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
