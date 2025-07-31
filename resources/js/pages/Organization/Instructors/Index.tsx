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
import { MoreHorizontal } from "lucide-react";

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
    club: Club | null;
}

interface Props {
    instructors: Instructor[];
    clubs?: Club[];
    filters: {
        club_id?: string;
    };
}

const columns: ColumnDef<Instructor>[] = [
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
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "organization.instructors.edit",
                                row.original.id
                            )}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "organization.instructors.destroy",
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
    clubs = [],
    filters,
}: Props) {
    const { props } = usePage();
  
    const [clubId, setClubId] = useState(filters.club_id || "");

    const handleFilterChange = (extraParams = {}) => {
        router.get(
            route("organization.instructors.index"),
            {
                club_id: clubId,
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
        setClubId("");
        router.get(route("organization.instructors.index"));
    };

    return (
        <AuthenticatedLayout header="Instructors">
            <Head title="Instructors" />
            <div className="p-4 space-y-6">
                {/* Filters */}
                <div className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col w-[200px]">
                        <Label className="text-sm mb-1">Club</Label>
                        <Select
                            value={clubId}
                            onValueChange={(val) => {
                                setClubId(val);
                                handleFilterChange({ club_id: val }); // ✅ use new value directly
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

                {/* Header and Create Button */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Instructors</h1>
                    <Link href={route("organization.instructors.create")}>
                        <Button>Add Instructor</Button>
                    </Link>
                </div>

                {/* Table */}
                <Card>
                    <DataTable columns={columns} data={instructors} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
