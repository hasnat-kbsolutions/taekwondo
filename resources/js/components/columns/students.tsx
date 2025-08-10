import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/RatingStars";

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
    average_rating: number;
    total_ratings: number;
};

export const columns = (
    onView: (student: Student) => void
): ColumnDef<Student>[] => [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
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
        id: "rating",
        header: "Rating",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <RatingStars
                    rating={
                        typeof row.original.average_rating === "number"
                            ? Math.round(row.original.average_rating)
                            : 0
                    }
                    readonly
                    size="sm"
                />
                <span className="text-sm text-muted-foreground">
                    ({row.original.total_ratings})
                </span>
            </div>
        ),
    },
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
        cell: ({ row }) => {
            const student = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(student)}>
                            <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link
                                href={route("admin.students.edit", student.id)}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.students.destroy",
                                    student.id
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
