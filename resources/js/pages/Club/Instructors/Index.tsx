import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import RatingStars from "@/components/RatingStars";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
}

interface Instructor {
    id: number;
    name: string;
    ic_number: string;
    email: string;
    address: string;
    mobile: string;
    grade: string;
    profile_picture: string | null;
    average_rating: number;
    total_ratings: number;
}

interface Props {
    instructors: Instructor[];
}

const columns = (
    onView: (instructor: Instructor) => void
): ColumnDef<Instructor>[] => [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        header: "Photo",
        cell: ({ row }) =>
            row.original.profile_picture ? (
                <img
                    src={row.original.profile_picture}
                    alt="Instructor"
                    className="w-10 h-10 object-cover rounded-full"
                />
            ) : (
                "-"
            ),
    },
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Email",
        accessorKey: "email",
    },
    {
        header: "IC Number",
        accessorKey: "ic_number",
    },
    {
        header: "Mobile",
        accessorKey: "mobile",
    },
    {
        header: "Grade",
        accessorKey: "grade",
    },
    {
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
        header: "Actions",
        cell: ({ row }) => {
            const instructor = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(instructor)}>
                            <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "club.instructors.edit",
                                    instructor.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "club.instructors.destroy",
                                    instructor.id
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

export default function Index({ instructors }: Props) {
    const [selectedInstructor, setSelectedInstructor] =
        useState<Instructor | null>(null);

    const handleView = (instructor: Instructor) => {
        setSelectedInstructor(instructor);
    };

    return (
        <AuthenticatedLayout header="Instructors">
            <Head title="Instructors" />
            <div className="container mx-auto py-10 space-y-6">
                {/* Instructors Table Card */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                Instructors
                            </h2>
                            <Link href={route("club.instructors.create")}>
                                <Button>Add Instructor</Button>
                            </Link>
                        </div>
                        <DataTable
                            columns={columns(handleView)}
                            data={instructors}
                        />
                    </div>
                </Card>
            </div>

            {/* View Instructor Dialog */}
            <Dialog
                open={!!selectedInstructor}
                onOpenChange={() => setSelectedInstructor(null)}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Instructor Details</DialogTitle>
                        <DialogDescription>
                            View detailed information about the instructor.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInstructor && (
                        <div className="space-y-6">
                            {/* Profile Image Section */}
                            <div className="flex justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    {selectedInstructor.profile_picture ? (
                                        <img
                                            src={
                                                selectedInstructor.profile_picture
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
                                            {selectedInstructor.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedInstructor.grade}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    {
                                        label: "Email",
                                        value: selectedInstructor.email,
                                    },
                                    {
                                        label: "Mobile",
                                        value:
                                            selectedInstructor.mobile ||
                                            "Not specified",
                                    },
                                    {
                                        label: "IC Number",
                                        value:
                                            selectedInstructor.ic_number ||
                                            "Not specified",
                                    },
                                    {
                                        label: "Grade",
                                        value:
                                            selectedInstructor.grade ||
                                            "Not specified",
                                    },
                                    {
                                        label: "Address",
                                        value:
                                            selectedInstructor.address ||
                                            "Not specified",
                                    },
                                    {
                                        label: "Rating",
                                        value: (
                                            <div className="flex items-center gap-2">
                                                <RatingStars
                                                    rating={
                                                        typeof selectedInstructor.average_rating ===
                                                        "number"
                                                            ? Math.round(
                                                                  selectedInstructor.average_rating
                                                              )
                                                            : 0
                                                    }
                                                    readonly
                                                    size="sm"
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {typeof selectedInstructor.average_rating ===
                                                    "number"
                                                        ? selectedInstructor.average_rating.toFixed(
                                                              1
                                                          )
                                                        : "0.0"}{" "}
                                                    (
                                                    {
                                                        selectedInstructor.total_ratings
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
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
