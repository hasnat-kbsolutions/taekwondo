import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
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
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/RatingStars";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";

interface Club {
    id: number;
    name: string;
}

export type Student = {
    id: number;
    uid: string;
    code: string;
    name: string;
    surname: string;
    nationality: string;
    dob: string;
    dod: string | null;
    grade: string;
    gender: string;
    id_passport: string;
    profile_image: string | null;
    identification_document: string | null;
    email: string;
    phone: string;
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

// Define the columns inline here - Organization view
export const columns = (onDelete?: (student: Student) => void): ColumnDef<Student>[] => [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        id: "profile_image",
        header: "Photo",
        cell: ({ row }) => {
            const imageUrl = row.original.profile_image;
            if (imageUrl) {
                // Handle both relative paths and full URLs
                const fullUrl = imageUrl.startsWith("http")
                    ? imageUrl
                    : `/storage/${imageUrl}`;
                return (
                    <div className="relative">
                        <img
                            src={fullUrl}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden"
                                );
                            }}
                        />
                        <span className="text-gray-400 italic text-xs hidden absolute inset-0 flex items-center justify-center">
                            No image
                        </span>
                    </div>
                );
            }
            return <span className="text-gray-400 italic">No image</span>;
        },
    },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "surname", header: "Surname" },
    { accessorKey: "dob", header: "DOB" },
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
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={route("organization.students.edit", row.original.id)}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            if (onDelete && confirm("Are you sure you want to delete this student?")) {
                                onDelete(row.original);
                            }
                        }}
                        className="text-red-600"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
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

    const handleDelete = (student: Student) => {
        router.delete(route("organization.students.destroy", student.id), {
            onSuccess: () => {
                router.visit(route("organization.students.index"));
            },
        });
    };

    return (
        <AuthenticatedLayout header="Students">
            <Head title="Students" />
            <div className="container mx-auto py-10">
                {/* Students Table Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Students</CardTitle>
                        {!clubId && (
                            <Link href={route("organization.students.create")}>
                                <Button>Add Student</Button>
                            </Link>
                        )}
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
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
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
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
                                    <Label className="text-sm mb-1">
                                        Country
                                    </Label>
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
                                    <Label className="text-sm mb-1">
                                        Status
                                    </Label>
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
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
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
                                        variant="secondary"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* DataTable */}
                        <DataTable
                            columns={columns(handleDelete)}
                            data={students}
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
