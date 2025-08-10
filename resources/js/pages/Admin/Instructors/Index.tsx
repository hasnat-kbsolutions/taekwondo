import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import RatingStars from "@/components/RatingStars";

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
    organization: Organization;
    club: Club | null;
    average_rating: number;
    total_ratings: number;
}

interface Props {
    instructors: Instructor[];
    organizations?: Organization[];
    clubs?: Club[];
    filters: {
        organization_id?: string;
        club_id?: string;
    };
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
        header: "Organization",
        cell: ({ row }) => row.original.organization?.name ?? "-",
    },
    {
        header: "Club",
        cell: ({ row }) => row.original.club?.name ?? "-",
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
                        <Link
                            href={route(
                                "admin.instructors.edit",
                                row.original.id
                            )}
                        >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "admin.instructors.destroy",
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

export default function Index({
    instructors,
    organizations = [],
    clubs = [],
    filters,
}: Props) {
    const { props } = usePage();
    const [organizationId, setOrganizationId] = useState(
        filters.organization_id || ""
    );
    const [clubId, setClubId] = useState(filters.club_id || "");

    const [selectedInstructor, setSelectedInstructor] =
        useState<Instructor | null>(null);
    const handleFilterChange = (extraParams = {}) => {
        router.get(
            route("admin.instructors.index"),
            {
                organization_id: organizationId || null,
                club_id: clubId || null,
                ...extraParams,
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
        setClubId("");
        router.get(route("admin.instructors.index"));
    };

    return (
        <AuthenticatedLayout header="Instructors">
            <Head title="Instructors" />

            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
                            <div className="flex flex-col w-[200px]">
                                <Label className="text-sm mb-1">
                                    Organization
                                </Label>
                                <Select
                                    value={organizationId}
                                    onValueChange={(val) => {
                                        setOrganizationId(val);
                                        handleFilterChange({ club_id: clubId });
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
                                <Label className="text-sm mb-1">Club</Label>
                                <Select
                                    value={clubId}
                                    onValueChange={(val) => {
                                        setClubId(val);
                                        handleFilterChange({
                                            organization_id: organizationId,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Clubs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {clubs.map((club) => (
                                            <SelectItem
                                                key={club.id}
                                                value={club.id.toString()}
                                            >
                                                {club.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button
                                    className="flex flex-wrap items-center gap-2 md:flex-row bg-primary text-background"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="container mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Instructors</CardTitle>
                        <Link href={route("admin.instructors.create")}>
                            <Button>Add Instructor</Button>
                        </Link>
                    </CardHeader>

                    <CardContent>
                        <DataTable
                            columns={columns((instructor) =>
                                setSelectedInstructor(instructor)
                            )}
                            data={instructors}
                        />
                    </CardContent>
                </Card>
                {selectedInstructor && (
                    <Dialog
                        open={!!selectedInstructor}
                        onOpenChange={(open) => {
                            if (!open) setSelectedInstructor(null);
                        }}
                    >
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Instructor Details</DialogTitle>
                                <DialogDescription>
                                    View detailed information about the
                                    instructor.
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
                                                label: "Organization",
                                                value:
                                                    selectedInstructor
                                                        .organization?.name ||
                                                    "Not assigned",
                                            },
                                            {
                                                label: "Club",
                                                value:
                                                    selectedInstructor.club
                                                        ?.name ||
                                                    "Not assigned",
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
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
