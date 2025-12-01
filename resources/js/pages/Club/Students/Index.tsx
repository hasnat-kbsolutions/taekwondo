import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/RatingStars";
import { Label } from "@/components/ui/label";
import { FileText, MoreHorizontal, Trash2, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export type Student = {
    id: number;
    uid: string;
    code: string;
    name: string;
    surname: string;
    nationality: string;
    dob: string;
    dod: string | null;
    grade: string;
    gender: string;
    id_passport: string;
    profile_image: string | null;
    identification_document: string | null;
    email: string;
    phone: string;
    city: string;
    postal_code: string;
    street: string;
    country: string;
    status: boolean;
    average_rating: number;
    total_ratings: number;
    organization?: {
        id: number;
        name: string;
    };
    club?: {
        id: number;
        name: string;
    };
};

interface Props {
    students: Student[];
}

// Define the columns inline here - club view with edit/delete actions
export const columns = (onDelete?: (student: Student) => void): ColumnDef<Student>[] => [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        id: "profile_image",
        header: "Photo",
        cell: ({ row }) => {
            const imageUrl = row.original.profile_image;
            if (imageUrl) {
                // Handle both relative paths and full URLs
                const fullUrl = imageUrl.startsWith("http")
                    ? imageUrl
                    : `/storage/${imageUrl}`;
                return (
                    <div className="relative">
                        <img
                            src={fullUrl}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden"
                                );
                            }}
                        />
                        <span className="text-gray-400 italic text-xs hidden absolute inset-0 flex items-center justify-center">
                            No image
                        </span>
                    </div>
                );
            }
            return <span className="text-gray-400 italic">No image</span>;
        },
    },
    { accessorKey: "code", header: "Code" },
    {
        id: "fullName",
        header: "Name",
        cell: ({ row }) => `${row.original.name} ${row.original.surname || ''}`.trim(),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "dob", header: "DOB" },
    { accessorKey: "id_passport", header: "ID/Passport" },
    {
        id: "identification_document",
        header: "Documents",
        cell: ({ row }) => {
            const docUrl = row.original.identification_document;
            if (docUrl) {
                // Handle both relative paths and full URLs
                const fullUrl = docUrl.startsWith("http")
                    ? docUrl
                    : `/storage/${docUrl}`;
                return (
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                        >
                            View Doc
                        </a>
                    </div>
                );
            }
            return <span className="text-gray-400 italic text-xs">No doc</span>;
        },
    },
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
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={route("club.student-insights.show", row.original.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={route("club.students.edit", row.original.id)}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            if (onDelete && confirm("Are you sure you want to delete this student?")) {
                                onDelete(row.original);
                            }
                        }}
                        className="text-red-600"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function Index({ students }: Props) {
    const handleDelete = (student: Student) => {
        router.delete(route("club.students.destroy", student.id));
    };

    return (
        <AuthenticatedLayout header="Students">
            <Head title="Students" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Students</CardTitle>
                        <Link href={route("club.students.create")}>
                            <Button>Add Student</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns(handleDelete)}
                            data={students}
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
