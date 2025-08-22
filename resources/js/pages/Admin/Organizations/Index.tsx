import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// ----------------- Interfaces -----------------
interface Student {
    id: number;
    name: string;
}

interface Supporter {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
    city?: string;
    country?: string;
}

interface Instructor {
    id: number;
    name: string;
    email?: string;
    grade?: string;
}

interface Organization {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    website?: string;
    street?: string;
    postal_code?: string;
    status: boolean;
    default_currency?: string;
    students: Student[];
    supporters: Supporter[];
    clubs: Club[];
    instructors: Instructor[];
}

interface Props {
    organizations: Organization[];
    student: number;
    supporter: number;
}

// ----------------- Component Start -----------------
export default function Index({ organizations, student, supporter }: Props) {
    // Ensure organizations is always an array to prevent runtime errors
    const safeOrganizations = Array.isArray(organizations) ? organizations : [];

    const [selectedOrganization, setSelectedOrganization] =
        useState<Organization | null>(null);

    const columns: ColumnDef<Organization>[] = [
        {
            header: "ID",
            accessorKey: "id",
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
            header: "Phone",
            accessorKey: "phone",
        },
        {
            header: "City",
            accessorKey: "city",
        },
        {
            header: "Country",
            accessorKey: "country",
        },
        {
            header: "Students",
            cell: ({ row }) => (
                <Link
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    href={route("admin.students.index", {
                        organization_id: row.original.id,
                    })}
                >
                    <Eye className="w-4 h-4" />
                    {row.original.students?.length ?? 0}
                </Link>
            ),
        },
        {
            header: "Supporters",
            cell: ({ row }) => (
                <Link
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    href={route("admin.supporters.index", {
                        organization_id: row.original.id,
                    })}
                >
                    <Eye className="w-4 h-4" />
                    {row.original.supporters?.length ?? 0}
                </Link>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status ? "default" : "destructive"}
                >
                    {row.original.status ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            header: "Default Currency",
            accessorKey: "default_currency",
            cell: ({ row }) => {
                const currency = row.original.default_currency;
                return currency ? (
                    <Badge variant="outline" className="font-mono">
                        {currency}
                    </Badge>
                ) : (
                    <span className="text-gray-400">Not set</span>
                );
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                setSelectedOrganization(row.original)
                            }
                        >
                            <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.organizations.edit",
                                    row.original.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.organizations.destroy",
                                    row.original.id
                                )}
                                method="delete"
                                as="button"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AuthenticatedLayout header="Ahli Gabungan">
            <Head title="Organizations" />
            <div className="container mx-auto py-10">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg
                                        className="h-4 w-4 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Students
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {Number(
                                            safeOrganizations.reduce(
                                                (total, org) =>
                                                    total +
                                                    Number(
                                                        org.students?.length ||
                                                            0
                                                    ),
                                                0
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg
                                        className="h-4 w-4 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Instructors
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {Number(
                                            safeOrganizations.reduce(
                                                (total, org) =>
                                                    total +
                                                    Number(
                                                        org.instructors
                                                            ?.length || 0
                                                    ),
                                                0
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg
                                        className="h-4 w-4 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Clubs
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {Number(
                                            safeOrganizations.reduce(
                                                (total, org) =>
                                                    total +
                                                    Number(
                                                        org.clubs?.length || 0
                                                    ),
                                                0
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <svg
                                        className="h-4 w-4 text-orange-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Supporters
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {Number(
                                            safeOrganizations.reduce(
                                                (total, org) =>
                                                    total +
                                                    Number(
                                                        org.supporters
                                                            ?.length || 0
                                                    ),
                                                0
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Organizations</CardTitle>
                        <Link href={route("admin.organizations.create")}>
                            <Button>Add Supporter</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={safeOrganizations} />
                    </CardContent>
                </Card>

                {/* View Dialog */}
                {selectedOrganization && (
                    <Dialog
                        open={!!selectedOrganization}
                        onOpenChange={(open) => {
                            if (!open) setSelectedOrganization(null);
                        }}
                    >
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Organization Details</DialogTitle>
                                <DialogDescription>
                                    View detailed information about the
                                    organization.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedOrganization && (
                                <div className="space-y-6">
                                    {/* Organization Header Section */}
                                    <div className="flex justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-primary/10 text-primary text-4xl font-bold border-2 border-primary/20 shadow-lg">
                                                {selectedOrganization.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-semibold text-xl">
                                                    {selectedOrganization.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Organization ID:{" "}
                                                    {selectedOrganization.id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Details Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            {
                                                label: "Email",
                                                value:
                                                    selectedOrganization.email ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Phone",
                                                value:
                                                    selectedOrganization.phone ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "City",
                                                value:
                                                    selectedOrganization.city ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Country",
                                                value:
                                                    selectedOrganization.country ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Street",
                                                value:
                                                    selectedOrganization.street ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Postal Code",
                                                value:
                                                    selectedOrganization.postal_code ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Website",
                                                value: selectedOrganization.website ? (
                                                    <a
                                                        href={
                                                            selectedOrganization.website
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary underline hover:text-primary/80"
                                                    >
                                                        {
                                                            selectedOrganization.website
                                                        }
                                                    </a>
                                                ) : (
                                                    "Not specified"
                                                ),
                                            },
                                            {
                                                label: "Status",
                                                value: (
                                                    <Badge
                                                        variant={
                                                            selectedOrganization.status
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                    >
                                                        {selectedOrganization.status
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                ),
                                            },
                                        ].map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="space-y-1"
                                            >
                                                <Label className="text-sm font-medium text-muted-foreground">
                                                    {item.label}
                                                </Label>
                                                <div className="text-sm">
                                                    {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Related Data Sections */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Students Section */}
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/50">
                                            <h5 className="font-semibold mb-3 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                                    />
                                                </svg>
                                                Students (
                                                {selectedOrganization.students
                                                    ?.length || 0}
                                                )
                                            </h5>
                                            <div className="max-h-40 overflow-y-auto">
                                                {selectedOrganization.students
                                                    ?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {selectedOrganization.students.map(
                                                            (student) => (
                                                                <div
                                                                    key={
                                                                        student.id
                                                                    }
                                                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                                                >
                                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                        {
                                                                            student.name
                                                                        }
                                                                    </span>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                                                    >
                                                                        ID:{" "}
                                                                        {
                                                                            student.id
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <svg
                                                            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1}
                                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                                            />
                                                        </svg>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                            No students found
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Instructors Section */}
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/50">
                                            <h5 className="font-semibold mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Instructors (
                                                {selectedOrganization
                                                    .instructors?.length || 0}
                                                )
                                            </h5>
                                            <div className="max-h-40 overflow-y-auto">
                                                {selectedOrganization
                                                    .instructors?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {selectedOrganization.instructors.map(
                                                            (instructor) => (
                                                                <div
                                                                    key={
                                                                        instructor.id
                                                                    }
                                                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                                                >
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                            {
                                                                                instructor.name
                                                                            }
                                                                        </div>
                                                                        {instructor.grade && (
                                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                                Grade:{" "}
                                                                                {
                                                                                    instructor.grade
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                                                                    >
                                                                        ID:{" "}
                                                                        {
                                                                            instructor.id
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <svg
                                                            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1}
                                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                            No instructors found
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Clubs Section */}
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/50">
                                            <h5 className="font-semibold mb-3 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                    />
                                                </svg>
                                                Clubs (
                                                {selectedOrganization.clubs
                                                    ?.length || 0}
                                                )
                                            </h5>
                                            <div className="max-h-40 overflow-y-auto">
                                                {selectedOrganization.clubs
                                                    ?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {selectedOrganization.clubs.map(
                                                            (club) => (
                                                                <div
                                                                    key={
                                                                        club.id
                                                                    }
                                                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                                                >
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                            {
                                                                                club.name
                                                                            }
                                                                        </div>
                                                                        {club.city && (
                                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                                {
                                                                                    club.city
                                                                                }

                                                                                ,{" "}
                                                                                {
                                                                                    club.country
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                                                    >
                                                                        ID:{" "}
                                                                        {
                                                                            club.id
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <svg
                                                            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1}
                                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                            />
                                                        </svg>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                            No clubs found
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Supporters Section */}
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/50">
                                            <h5 className="font-semibold mb-3 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                    />
                                                </svg>
                                                Supporters (
                                                {selectedOrganization.supporters
                                                    ?.length || 0}
                                                )
                                            </h5>
                                            <div className="max-h-40 overflow-y-auto">
                                                {selectedOrganization.supporters
                                                    ?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {selectedOrganization.supporters.map(
                                                            (supporter) => (
                                                                <div
                                                                    key={
                                                                        supporter.id
                                                                    }
                                                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                                                >
                                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                        {
                                                                            supporter.name
                                                                        }
                                                                    </span>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                                                                    >
                                                                        ID:{" "}
                                                                        {
                                                                            supporter.id
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <svg
                                                            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1}
                                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                            />
                                                        </svg>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                            No supporters found
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
