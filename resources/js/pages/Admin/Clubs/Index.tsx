import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PageProps } from "@/types"; // We'll define this below
import {
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    Users,
    GraduationCap,
    Heart,
    DollarSign,
} from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
    city?: string;
    country?: string;
    logo?: string;
    phone?: string;
    tax_number?: string;
    invoice_prefix?: string;
    status: boolean;
    organization: Organization;
    user?: User;
    students?: Student[];
    instructors?: Instructor[];
    supporters?: Supporter[];
    payment_stats?: {
        total_payments: number;
        paid_count: number;
        pending_count: number;
        total_amount: number;
        average_amount: number;
    };
    attendance_stats?: {
        total_attendances: number;
        present_count: number;
        absent_count: number;
        late_count: number;
        attendance_rate: number;
    };
    certification_stats?: {
        total_certifications: number;
        completed_count: number;
        pending_count: number;
        completion_rate: number;
    };
    performance_metrics?: {
        total_members: number;
        student_to_instructor_ratio: number;
        monthly_revenue: number;
    };
}

interface Student {
    id: number;
    name: string;
    email?: string;
}

interface Instructor {
    id: number;
    name: string;
    email?: string;
}

interface Supporter {
    id: number;
    name: string;
    email?: string;
}

interface Props {
    clubs: Club[];
    organizations?: Organization[]; // optional
    filters: {
        organization_id?: string;
        country?: string;
    };
}

const columns = (onView: (instructor: Club) => void): ColumnDef<Club>[] => [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        header: "Logo",
        cell: ({ row }) =>
            row.original.logo ? (
                <img
                    src={row.original.logo}
                    alt="Club Logo"
                    className="w-10 h-10 object-cover rounded"
                />
            ) : (
                "-"
            ),
    },
    {
        header: "Club Name",
        cell: ({ row }) => row.original.user?.name ?? "-",
    },
    {
        header: "Organization",
        cell: ({ row }) => row.original.organization?.name ?? "-",
    },
    {
        header: "Location",
        cell: ({ row }) => (
            <div className="text-sm">
                {row.original.city && row.original.country ? (
                    <>
                        <div>{row.original.city}</div>
                        <div className="text-muted-foreground">
                            {row.original.country}
                        </div>
                    </>
                ) : (
                    row.original.city || row.original.country || "-"
                )}
            </div>
        ),
    },

    {
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status ? "default" : "destructive"}>
                {row.original.status ? "Active" : "Inactive"}
            </Badge>
        ),
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
                    <DropdownMenuItem onClick={() => onView(row.original)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={route("admin.clubs.edit", row.original.id)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("admin.clubs.destroy", row.original.id)}
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

export default function Index({ clubs, organizations = [], filters }: Props) {
    // Ensure clubs is always an array to prevent runtime errors
    const safeClubs = Array.isArray(clubs) ? clubs : [];

    const [organizationId, setOrganizationId] = useState(
        filters.organization_id || ""
    );
    const [country, setCountry] = useState(filters.country || "");

    const handleFilterChange = (extraParams = {}) => {
        router.get(
            route("admin.clubs.index"),
            {
                ...extraParams,
                organization_id: organizationId || null,
                country: country || null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setOrganizationId("");
        setCountry("");
        router.get(
            route("admin.clubs.index"),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    return (
        <AuthenticatedLayout header="Clubs">
            <Head title="Organizations" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap ">
                            <div className="flex flex-col w-[200px]">
                                <Label className="text-sm mb-1">
                                    Organizations
                                </Label>
                                <Select
                                    value={organizationId || ""}
                                    onValueChange={(val) => {
                                        setOrganizationId(val);
                                        handleFilterChange({ country });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Organizations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {organizations.map((org) => (
                                            <SelectItem
                                                key={org.id}
                                                value={org.id.toString()}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col w-[200px]">
                                <Label className="text-sm mb-1">Country</Label>
                                <CountryDropdown
                                    placeholder="All Countries"
                                    defaultValue={country || ""}
                                    onChange={(c) => {
                                        const selected = c?.alpha3 || "";
                                        setCountry(selected);
                                        handleFilterChange({
                                            organization_id: organizationId,
                                        });
                                    }}
                                    slim={false}
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    className="flex flex-wrap items-center gap-2 md:flex-row bg-primary text-white dark:text-black"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="container mx-auto ">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Students
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {Number(
                                            safeClubs.reduce(
                                                (total, club) =>
                                                    total +
                                                    Number(club.students?.length || 0),
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
                                    <GraduationCap className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Instructors
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {Number(
                                            safeClubs.reduce(
                                                (total, club) =>
                                                    total +
                                                    Number(club.instructors?.length || 0),
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
                                    <Heart className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Supporters
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {Number(
                                            safeClubs.reduce(
                                                (total, club) =>
                                                    total +
                                                    Number(club.supporters?.length || 0),
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
                                    <DollarSign className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Revenue
                                    </p>
                                    <p className="text-2xl font-bold">
                                        $
                                        {Number(
                                            safeClubs.reduce(
                                                (total, club) =>
                                                    total +
                                                    Number(club.payment_stats
                                                        ?.total_amount || 0),
                                                0
                                            )
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Clubs</CardTitle>
                        <Link href={route("admin.clubs.create")}>
                            {" "}
                            <Button>Add Club</Button>{" "}
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns((club) => setSelectedClub(club))}
                            data={safeClubs}
                        />
                    </CardContent>
                </Card>
                {/* View Dialog */}
                {selectedClub && (
                    <Dialog
                        open={!!selectedClub}
                        onOpenChange={(open) => {
                            if (!open) setSelectedClub(null);
                        }}
                    >
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Club Details</DialogTitle>
                                <DialogDescription>
                                    View detailed information about the club.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedClub && (
                                <div className="space-y-6">
                                    {/* Club Header Section */}
                                    <div className="flex justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-primary/10 text-primary text-4xl font-bold border-2 border-primary/20 shadow-lg">
                                                {selectedClub.logo ? (
                                                    <img
                                                        src={selectedClub.logo}
                                                        alt="Club Logo"
                                                        className="w-32 h-32 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    selectedClub.name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-semibold text-xl">
                                                    {selectedClub.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Club ID: {selectedClub.id}
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
                                                    selectedClub.user?.email ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Phone",
                                                value:
                                                    selectedClub.phone ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "City",
                                                value:
                                                    selectedClub.city ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Country",
                                                value:
                                                    selectedClub.country ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Tax Number",
                                                value:
                                                    selectedClub.tax_number ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Invoice Prefix",
                                                value:
                                                    selectedClub.invoice_prefix ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Organization",
                                                value:
                                                    selectedClub.organization
                                                        ?.name ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Status",
                                                value: (
                                                    <Badge
                                                        variant={
                                                            selectedClub.status
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                    >
                                                        {selectedClub.status
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                ),
                                            },
                                        ].map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex flex-col space-y-1"
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

                                    {/* Students List */}
                                    {selectedClub.students &&
                                        selectedClub.students.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Students (
                                                        {
                                                            selectedClub
                                                                .students.length
                                                        }
                                                        )
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {selectedClub.students.map(
                                                            (student) => (
                                                                <div
                                                                    key={
                                                                        student.id
                                                                    }
                                                                    className="flex items-center justify-between p-2 border rounded-lg"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                                                                            {student.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {
                                                                                    student.name
                                                                                }
                                                                            </p>
                                                                            {student.email && (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {
                                                                                        student.email
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                    {/* Instructors List */}
                                    {selectedClub.instructors &&
                                        selectedClub.instructors.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Instructors (
                                                        {
                                                            selectedClub
                                                                .instructors
                                                                .length
                                                        }
                                                        )
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {selectedClub.instructors.map(
                                                            (instructor) => (
                                                                <div
                                                                    key={
                                                                        instructor.id
                                                                    }
                                                                    className="flex items-center justify-between p-2 border rounded-lg"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                                                                            {instructor.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {
                                                                                    instructor.name
                                                                                }
                                                                            </p>
                                                                            {instructor.email && (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {
                                                                                        instructor.email
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                    {/* Supporters List */}
                                    {selectedClub.supporters &&
                                        selectedClub.supporters.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Supporters (
                                                        {
                                                            selectedClub
                                                                .supporters
                                                                .length
                                                        }
                                                        )
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {selectedClub.supporters.map(
                                                            (supporter) => (
                                                                <div
                                                                    key={
                                                                        supporter.id
                                                                    }
                                                                    className="flex items-center justify-between p-2 border rounded-lg"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                                                                            {supporter.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {
                                                                                    supporter.name
                                                                                }
                                                                            </p>
                                                                            {supporter.email && (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {
                                                                                        supporter.email
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
