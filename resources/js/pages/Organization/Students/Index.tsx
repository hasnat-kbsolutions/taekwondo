import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";interface Club {
    id: number;
    name: string;
}

interface Props {
    students: Student[];
    clubs?: Club[];
    nationalities?: string[];
    countries?: string[];
    filters: {
        club_id?: string;
        nationality?: string;
        country?: string;
        status?: string;
    };
}

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
                            href={route("organization.students.edit", row.original.id)}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "organization.students.destroy",
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
    students,
    clubs = [],
    nationalities = [],
    countries = [],
    filters,
}: Props) {
    const [clubId, setClubId] = useState(filters.club_id || "");
    const [nationality, setNationality] = useState(filters.nationality || "");
    const [country, setCountry] = useState(filters.country || "");
    const [status, setStatus] = useState(filters.status || "");

    const handleFilterChange = (params: {
        club_id?: string;
        nationality?: string;
        country?: string;
        status?: string;
    }) => {
        router.get(
            route("organization.students.index"),
            {
                club_id: params.club_id ?? (clubId || null),
                nationality: params.nationality ?? (nationality || null),
                country: params.country ?? (country || null),
                status: params.status ?? (status || null),
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
        setNationality("");
        setCountry("");
        setStatus("");
        router.get(
            route("organization.students.index"),
            {},
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout header="Students">
            <Head title="Students" />
            <div className="container mx-auto py-10 space-y-6">
                {/* Filters Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
                            {/* Club Filter */}
                            <div className="flex flex-col w-[200px]">
                                <Label className="text-sm mb-1">Club</Label>
                                <Select
                                    value={clubId}
                                    onValueChange={(val) => {
                                        const selected =
                                            val === "all" ? "" : val;
                                        setClubId(selected);
                                        handleFilterChange({
                                            club_id: selected,
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

                            {/* Nationality Filter */}
                            <div className="w-[200px]">
                                <Label className="text-sm mb-1">
                                    Nationality
                                </Label>
                                <CountryDropdown
                                    placeholder="All Nationalities"
                                    defaultValue={nationality || ""}
                                    onChange={(c) => {
                                        const selected = c?.alpha3 || "";
                                        setNationality(selected);
                                        handleFilterChange({
                                            nationality: selected,
                                        });
                                    }}
                                    slim={false}
                                />
                            </div>

                            {/* Country Filter */}
                            <div className="w-[200px]">
                                <Label className="text-sm mb-1">Country</Label>
                                <CountryDropdown
                                    placeholder="All Countries"
                                    defaultValue={country || ""}
                                    onChange={(c) => {
                                        const selected = c?.alpha3 || "";
                                        setCountry(selected);
                                        handleFilterChange({
                                            country: selected,
                                        });
                                    }}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex flex-col w-[200px]">
                                <Label className="text-sm mb-1">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={(val) => {
                                        const selected =
                                            val === "all" ? "" : val;
                                        setStatus(selected);
                                        handleFilterChange({
                                            status: selected,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reset Button */}
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

                {/* Students Table Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Students</CardTitle>
                        <Link href={route("organization.students.create")}>
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
