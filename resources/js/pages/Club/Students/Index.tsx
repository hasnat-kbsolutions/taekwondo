import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
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

interface Props {
    students: Student[];
}

// Define the columns inline here
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
    // { accessorKey: "uid", header: "UID" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "surname", header: "Surname" },
    // { accessorKey: "nationality", header: "Nationality" },
    { accessorKey: "dob", header: "DOB" },
    // { accessorKey: "dod", header: "DOD" },
    // { accessorKey: "grade", header: "Grade" },
    // { accessorKey: "gender", header: "Gender" },
    { accessorKey: "id_passport", header: "ID/Passport" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    // { accessorKey: "skype", header: "Skype" },
    // { accessorKey: "website", header: "Website" },
    // { accessorKey: "city", header: "City" },
    // { accessorKey: "postal_code", header: "Postal Code" },
    // { accessorKey: "street", header: "Street" },
    // { accessorKey: "country", header: "Country" },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status ? "default" : "destructive"}>
                {row.original.status ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    // {
    //     id: "profile_image",
    //     header: "Profile Image",
    //     cell: ({ row }) =>
    //         row.original.profile_image ? (
    //             <img
    //                 src={`/storage/${row.original.profile_image}`}
    //                 alt="profile"
    //                 className="w-12 h-12 rounded-full object-cover"
    //             />
    //         ) : (
    //             <span className="text-gray-400 italic">No image</span>
    //         ),
    // },
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
                            href={route("club.students.edit", row.original.id)}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "club.students.destroy",
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

export default function Index({ students }: Props) {
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
                        <DataTable columns={columns} data={students} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
