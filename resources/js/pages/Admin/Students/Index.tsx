import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Head, Link, router } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns, Student } from "@/components/columns/students";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PageProps } from "@/types";
import { route } from "ziggy-js";

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
    organizations?: Organization[];
    clubs?: Club[];
    nationalities?: string[];
    countries?: string[];
    filters: {
        organization_id?: string;
        club_id?: string;
        nationality?: string;
        country?: string;
        status?: string;
    };
}

export default function Index({
    students,
    organizations = [],
    clubs = [],
    nationalities = [],
    countries = [],
    filters,
}: Props) {
    const { props } = usePage<{
        flash?: {
            import_log?: any[];
            error?: string | string[];
            success?: string;
        };
    }>();
    const [importSuccess, setImportSuccess] = useState(false);
    const [importLogs, setImportLogs] = useState<string[]>([]);
    const [organizationId, setOrganizationId] = useState(
        filters.organization_id || "all"
    );
    const [clubId, setClubId] = useState(filters.club_id || "all");
    const [nationality, setNationality] = useState(
        filters.nationality || "all"
    );
    const [country, setCountry] = useState(filters.country || "all");
    const [status, setStatus] = useState(filters.status || "all");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null
    );

    useEffect(() => {
        // Listen for import log and show modal if present
        if (props.flash?.import_log) {
            const logArr = props.flash.import_log;
            let summary = logArr.find((l: any) => l.summary);
            let details = logArr.filter((l: any) => l.status);
            let logs: string[] = [];
            if (summary) {
                logs.push(
                    `Total: ${summary.total}, Success: ${summary.success}, Failed: ${summary.failed}, Percentage: ${summary.percentage}%` +
                        (summary.error ? `, Error: ${summary.error}` : "")
                );
            }
            details.forEach((l: any) => {
                logs.push(
                    `${l.status === "success" ? "✅" : "❌"} ${l.message}`
                );
            });
            setImportLogs(logs);
            setImportSuccess(true);
        }
    }, [props.flash?.import_log]);

    const handleFilterChange = (params: {
        organization_id?: string;
        club_id?: string;
        nationality?: string;
        country?: string;
        status?: string;
    }) => {
        router.get(
            route("admin.students.index"),
            {
                organization_id:
                    params.organization_id ??
                    (organizationId !== "all" ? organizationId : null),
                club_id: params.club_id ?? (clubId !== "all" ? clubId : null),
                nationality:
                    params.nationality ?? (nationality ? nationality : null),
                country: params.country ?? (country ? country : null),
                status: params.status ?? (status !== "all" ? status : null),
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setOrganizationId("all");
        setClubId("all");
        setNationality("");
        setCountry("");
        setStatus("all");
        router.get(
            route("admin.students.index"),
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
                        <CardTitle>Import / Export Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <Button asChild variant="outline">
                                <a href={route("admin.students.export")}>
                                    Export Students
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters Section */}
                <Card className="my-6">
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4 items-end">
                            {/* Organization Filter */}
                            <div>
                                <Label htmlFor="organization">
                                    Organization
                                </Label>
                                <Select
                                    value={organizationId}
                                    onValueChange={(value) => {
                                        setOrganizationId(value);
                                        handleFilterChange({
                                            organization_id: value,
                                        });
                                    }}
                                >
                                    <SelectTrigger
                                        id="organization"
                                        className="w-48"
                                    >
                                        <SelectValue placeholder="All Organizations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {organizations.map((org) => (
                                            <SelectItem
                                                key={org.id}
                                                value={String(org.id)}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Club Filter */}
                            <div>
                                <Label htmlFor="club">Club</Label>
                                <Select
                                    value={clubId}
                                    onValueChange={(value) => {
                                        setClubId(value);
                                        handleFilterChange({ club_id: value });
                                    }}
                                >
                                    <SelectTrigger id="club" className="w-48">
                                        <SelectValue placeholder="All Clubs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {clubs.map((club) => (
                                            <SelectItem
                                                key={club.id}
                                                value={String(club.id)}
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
                                    slim={false}
                                />
                            </div>
                            {/* Status Filter */}
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={(value) => {
                                        setStatus(value);
                                        handleFilterChange({ status: value });
                                    }}
                                >
                                    <SelectTrigger id="status" className="w-32">
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
                            <div>
                                <Button
                                    variant="secondary"
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
                        <Link href={route("admin.students.create")}>
                            <Button>Add Student</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns((student) =>
                                setSelectedStudent(student)
                            )}
                            data={students}
                        />
                    </CardContent>
                </Card>
                {/* View Student Modal */}
                {selectedStudent && (
                    <Dialog
                        open={!!selectedStudent}
                        onOpenChange={(open) => {
                            if (!open) setSelectedStudent(null);
                        }}
                    >
                        <DialogContent>
                            <DialogTitle>Student Details</DialogTitle>
                            <DialogDescription>
                                Full student details
                            </DialogDescription>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Code:</strong>{" "}
                                    {selectedStudent.code}
                                </div>
                                <div>
                                    <strong>Name:</strong>{" "}
                                    {selectedStudent.name}{" "}
                                    {selectedStudent.surname}
                                </div>
                                <div>
                                    <strong>Email:</strong>{" "}
                                    {selectedStudent.email}
                                </div>
                                <div>
                                    <strong>Phone:</strong>{" "}
                                    {selectedStudent.phone}
                                </div>
                                <div>
                                    <strong>Gender:</strong>{" "}
                                    {selectedStudent.gender}
                                </div>
                                <div>
                                    <strong>Nationality:</strong>{" "}
                                    {selectedStudent.nationality}
                                </div>
                                <div>
                                    <strong>Country:</strong>{" "}
                                    {selectedStudent.country}
                                </div>
                                <div>
                                    <strong>DOB:</strong> {selectedStudent.dob}
                                </div>
                                <div>
                                    <strong>DOD:</strong>{" "}
                                    {selectedStudent.dod || "N/A"}
                                </div>
                                <div>
                                    <strong>Grade:</strong>{" "}
                                    {selectedStudent.grade}
                                </div>
                                <div>
                                    <strong>ID/Passport:</strong>{" "}
                                    {selectedStudent.id_passport}
                                </div>
                                <div>
                                    <strong>Skype:</strong>{" "}
                                    {selectedStudent.skype}
                                </div>
                                <div>
                                    <strong>Website:</strong>{" "}
                                    {selectedStudent.website}
                                </div>
                                <div>
                                    <strong>Address:</strong>{" "}
                                    {selectedStudent.street},{" "}
                                    {selectedStudent.city},{" "}
                                    {selectedStudent.postal_code}
                                </div>
                                <div>
                                    <strong>Status:</strong>{" "}
                                    <Badge
                                        variant={
                                            selectedStudent.status
                                                ? "default"
                                                : "destructive"
                                        }
                                    >
                                        {selectedStudent.status
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>

                                {/* Profile Image */}
                                <div className="col-span-2">
                                    <strong>Profile Image:</strong>
                                    <div className="mt-1">
                                        {selectedStudent.profile_image ? (
                                            <img
                                                src={
                                                    selectedStudent.profile_image
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

                                {/* ID Passport Image */}
                                <div className="col-span-2">
                                    <strong>ID/Passport Image:</strong>
                                    <div className="mt-1">
                                        {selectedStudent.id_passport_image ? (
                                            <img
                                                src={
                                                    selectedStudent.id_passport_image
                                                }
                                                alt="ID"
                                                className="w-24 h-24 rounded object-cover"
                                            />
                                        ) : (
                                            <span className="italic text-gray-500">
                                                No image
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Signature Image */}
                                <div className="col-span-2">
                                    <strong>Signature Image:</strong>
                                    <div className="mt-1">
                                        {selectedStudent.signature_image ? (
                                            <img
                                                src={
                                                    selectedStudent.signature_image
                                                }
                                                alt="Signature"
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
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
