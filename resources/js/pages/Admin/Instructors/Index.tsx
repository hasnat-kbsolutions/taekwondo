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
                        <DialogContent className="shadow-2xl p-10 max-w-xl ">
                            <div className="flex justify-between">
                                {/* Header: Title and Description */}
                                <div className="text-left mb-8">
                                    <DialogTitle className="text-3xl font-bold text-foreground">
                                        Instructor Details
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-foreground mt-1">
                                        Comprehensive information about the
                                        instructor
                                    </DialogDescription>
                                </div>

                                {/* Profile Image Centered */}
                                <div className="flex justify-center mb-6">
                                    <div className="flex flex-col items-center gap-2">
                                        {selectedInstructor.profile_picture ? (
                                            <img
                                                src={
                                                    selectedInstructor.profile_picture
                                                }
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover border boredr-gray-200 border-foreground shadow-md hover:shadow-lg transition duration-200"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-foreground  text-gray-400  text-sm italic border border-foreground ">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Details Grid */}
                            <div className="space-y-3">
                                {[
                                    {
                                        label: "Name",
                                        value: selectedInstructor.name,
                                    },
                                    {
                                        label: "Email",
                                        value: selectedInstructor.email,
                                    },
                                    {
                                        label: "IC Number",
                                        value: selectedInstructor.ic_number,
                                    },
                                    {
                                        label: "Mobile",
                                        value: selectedInstructor.mobile,
                                    },
                                    {
                                        label: "Grade",
                                        value: selectedInstructor.grade,
                                    },
                                    {
                                        label: "Organization",
                                        value:
                                            selectedInstructor.organization
                                                ?.name || "-",
                                    },
                                    {
                                        label: "Club",
                                        value:
                                            selectedInstructor.club?.name ||
                                            "-",
                                    },
                                    {
                                        label: "Address",
                                        value:
                                            selectedInstructor.address || "-",
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between text-foreground text-sm  "
                                    >
                                        <span className="font-medium  text-base text-foreground">
                                            {item.label}:
                                        </span>
                                        <span className="text-right text-foreground max-w-[60%] break-words">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
