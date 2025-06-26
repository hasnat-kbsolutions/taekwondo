import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

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
            <span
                className={
                    row.original.status ? "text-green-600" : "text-red-600"
                }
            >
                {row.original.status ? "Active" : "Inactive"}
            </span>
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
            <div className="flex space-x-2">
                <Link href={route("branch.students.edit", row.original.id)}>
                    <Button variant="outline" size="sm">
                        Edit
                    </Button>
                </Link>
                <Link
                    href={route("branch.students.destroy", row.original.id)}
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

export default function Index({ students }: Props) {
    return (
        <AuthenticatedLayout header="Students">
            <Head title="Students" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Students</CardTitle>
                        <Link href={route("branch.students.create")}>
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
