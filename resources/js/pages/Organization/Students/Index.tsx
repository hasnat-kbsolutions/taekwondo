import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns, Student } from "@/components/columns/students";
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

interface Organization {
    id: number;
    name: string;
}
interface Club {
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
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
                            {/* Organization Filter */}
          

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

                            {/* Reset */}
                            <div className="flex items-end ">
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

                {/* Table Section */}
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
