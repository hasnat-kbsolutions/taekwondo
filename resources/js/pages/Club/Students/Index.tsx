import React, { useState } from "react";
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
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/RatingStars";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
    website: string;
    city: string;
    postal_code: string;
    street: string;
    country: string;
    status: boolean;
    average_rating: number;
    total_ratings: number;
};

interface Props {
    students: Student[];
}

// Define the columns inline here
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
                                href={route("club.students.edit", student.id)}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "club.students.destroy",
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

export default function Index({ students }: Props) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null
    );

    const handleView = (student: Student) => {
        setSelectedStudent(student);
    };

    const handleClose = () => {
        setSelectedStudent(null);
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
                            columns={columns(handleView)}
                            data={students}
                        />
                    </CardContent>
                </Card>

                <Dialog open={!!selectedStudent} onOpenChange={handleClose}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Student Details</DialogTitle>
                            <DialogDescription>
                                View detailed information about the student.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedStudent && (
                            <div className="space-y-6">
                                {/* Profile Image Section */}
                                <div className="flex justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                        {selectedStudent.profile_image ? (
                                            <img
                                                src={
                                                    selectedStudent.profile_image
                                                }
                                                alt="Profile"
                                                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-sm italic border-2 border-gray-200">
                                                No Image
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <h3 className="font-semibold text-lg">
                                                {selectedStudent.name}{" "}
                                                {selectedStudent.surname}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedStudent.code}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            label: "UID",
                                            value: selectedStudent.uid,
                                        },
                                        {
                                            label: "Email",
                                            value: selectedStudent.email,
                                        },
                                        {
                                            label: "Phone",
                                            value: selectedStudent.phone,
                                        },
                                        {
                                            label: "Grade",
                                            value: selectedStudent.grade,
                                        },
                                        {
                                            label: "Gender",
                                            value: selectedStudent.gender,
                                        },
                                        {
                                            label: "Nationality",
                                            value: selectedStudent.nationality,
                                        },
                                        {
                                            label: "Date of Birth",
                                            value: selectedStudent.dob
                                                ? new Date(
                                                      selectedStudent.dob
                                                  ).toLocaleDateString()
                                                : "Not specified",
                                        },
                                        {
                                            label: "ID/Passport",
                                            value: selectedStudent.id_passport,
                                        },
                                        {
                                            label: "City",
                                            value:
                                                selectedStudent.city ||
                                                "Not specified",
                                        },
                                        {
                                            label: "Country",
                                            value:
                                                selectedStudent.country ||
                                                "Not specified",
                                        },
                                        {
                                            label: "Status",
                                            value: selectedStudent.status
                                                ? "Active"
                                                : "Inactive",
                                        },
                                        {
                                            label: "Rating",
                                            value: (
                                                <div className="flex items-center gap-2">
                                                    <RatingStars
                                                        rating={
                                                            typeof selectedStudent.average_rating ===
                                                            "number"
                                                                ? Math.round(
                                                                      selectedStudent.average_rating
                                                                  )
                                                                : 0
                                                        }
                                                        readonly
                                                        size="sm"
                                                    />
                                                    <span className="text-sm text-muted-foreground">
                                                        {typeof selectedStudent.average_rating ===
                                                        "number"
                                                            ? selectedStudent.average_rating.toFixed(
                                                                  1
                                                              )
                                                            : "0.0"}{" "}
                                                        (
                                                        {
                                                            selectedStudent.total_ratings
                                                        }{" "}
                                                        ratings)
                                                    </span>
                                                </div>
                                            ),
                                        },
                                    ].map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {item.label}
                                            </Label>
                                            <div className="text-sm">
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Attachments Section */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold mb-4">
                                        Attachments
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* ID/Passport Image */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                ID/Passport Image
                                            </Label>
                                            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 min-h-[200px] flex items-center justify-center">
                                                {selectedStudent.id_passport_image ? (
                                                    <img
                                                        src={
                                                            selectedStudent.id_passport_image
                                                        }
                                                        alt="ID/Passport"
                                                        className="max-w-full max-h-48 object-contain rounded"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        No ID/Passport image
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Signature Image */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Signature Image
                                            </Label>
                                            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 min-h-[200px] flex items-center justify-center">
                                                {selectedStudent.signature_image ? (
                                                    <img
                                                        src={
                                                            selectedStudent.signature_image
                                                        }
                                                        alt="Signature"
                                                        className="max-w-full max-h-48 object-contain rounded"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        No signature image
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
