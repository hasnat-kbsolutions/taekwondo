import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
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
import { MoreHorizontal } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
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
    organization: Organization;
    club: Club | null;
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
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "admin.instructors.edit",
                                row.original.id
                            )}
                        >
                            Edit
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
                            Delete
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

const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(
    null
);
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
                                    className="flex flex-wrap items-center gap-2 md:flex-row bg-primary text-black"
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
                        <DialogContent>
                            <DialogTitle>Instructor Details</DialogTitle>
                            <DialogDescription>
                                Full instructor details
                            </DialogDescription>

                            <div className="relative grid grid-cols-2 gap-4 text-sm before:absolute before:top-0 before:bottom-0 before:left-1/2 before:w-px before:bg-gray-200">
                                {/* Left column */}
                                <div className="space-y-2 pr-4">
                                    <div>
                                        <strong>Name:</strong>{" "}
                                        {selectedInstructor.name}
                                    </div>
                                    <div>
                                        <strong>Email:</strong>{" "}
                                        {selectedInstructor.email}
                                    </div>
                                    <div>
                                        <strong>IC Number:</strong>{" "}
                                        {selectedInstructor.ic_number}
                                    </div>
                                    <div>
                                        <strong>Mobile:</strong>{" "}
                                        {selectedInstructor.mobile}
                                    </div>
                                    <div>
                                        <strong>Grade:</strong>{" "}
                                        {selectedInstructor.grade}
                                    </div>
                                    <div>
                                        <strong>Organization:</strong>{" "}
                                        {selectedInstructor.organization
                                            ?.name || "-"}
                                    </div>
                                    <div>
                                        <strong>Club:</strong>{" "}
                                        {selectedInstructor.club?.name || "-"}
                                    </div>
                                </div>

                                {/* Right column */}
                                <div className="space-y-2 pl-4">
                                    <div>
                                        <strong>Address:</strong>{" "}
                                        {selectedInstructor.address}
                                    </div>

                                    <div className="pt-2">
                                        <strong>Profile Image:</strong>
                                        <div className="mt-1">
                                            {selectedInstructor.profile_picture ? (
                                                <img
                                                    src={
                                                        selectedInstructor.profile_picture
                                                    }
                                                    alt="Profile"
                                                    className="w-24 h-24 rounded object-cover"
                                                />
                                            ) : (
                                                <span className="italic text-gray-500">
                                                    No image
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
