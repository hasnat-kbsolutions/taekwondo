import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Head, Link, router, useForm } from "@inertiajs/react";
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
import RatingStars from "@/components/RatingStars";

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
    const [passwordChangeStudent, setPasswordChangeStudent] =
        useState<Student | null>(null);
    const passwordForm = useForm({
        password: "",
        password_confirmation: "",
    });

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
            <div className="container-fluid py-10 w-full">
                <Card>
                    <CardHeader className="flex  flex-row items-center justify-between">
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

                {/* Table Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Students</CardTitle>
                        <Link href={route("admin.students.create")}>
                            <Button>Add Student</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                            <div className="flex flex-wrap gap-4 items-end">
                                {/* Organization Filter */}
                                <div>
                                    <Label
                                        htmlFor="organization"
                                        className="text-sm mb-1"
                                    >
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
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
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
                                    <Label
                                        htmlFor="club"
                                        className="text-sm mb-1"
                                    >
                                        Club
                                    </Label>
                                    <Select
                                        value={clubId}
                                        onValueChange={(value) => {
                                            setClubId(value);
                                            handleFilterChange({
                                                club_id: value,
                                            });
                                        }}
                                    >
                                        <SelectTrigger
                                            id="club"
                                            className="w-48"
                                        >
                                            <SelectValue placeholder="All Clubs" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
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
                                        slim={false}
                                    />
                                </div>
                                {/* Status Filter */}
                                <div>
                                    <Label
                                        htmlFor="status"
                                        className="text-sm mb-1"
                                    >
                                        Status
                                    </Label>
                                    <Select
                                        value={status}
                                        onValueChange={(value) => {
                                            setStatus(value);
                                            handleFilterChange({
                                                status: value,
                                            });
                                        }}
                                    >
                                        <SelectTrigger
                                            id="status"
                                            className="w-32"
                                        >
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
                                <div>
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
                            columns={columns(
                                (student) => setSelectedStudent(student),
                                (student) => setPasswordChangeStudent(student)
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
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Student Details</DialogTitle>
                                <DialogDescription>
                                    View detailed information about the student.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedStudent && (
                                <div className="space-y-6">
                                    {/* Profile Image Section */}
                                    <div className="flex justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            {selectedStudent.profile_image ? (
                                                <div className="relative">
                                                    <img
                                                        src={
                                                            selectedStudent.profile_image.startsWith(
                                                                "http"
                                                            )
                                                                ? selectedStudent.profile_image
                                                                : `/storage/${selectedStudent.profile_image}`
                                                        }
                                                        alt="Profile"
                                                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow-lg"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display =
                                                                "none";
                                                            e.currentTarget.nextElementSibling?.classList.remove(
                                                                "hidden"
                                                            );
                                                        }}
                                                    />
                                                    <div className="w-32 h-32 hidden flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-sm italic border-2 border-gray-200">
                                                        No Image
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-sm italic border-2 border-gray-200">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="text-center">
                                                <h3 className="font-semibold text-lg">
                                                    {selectedStudent.name}{" "}
                                                    {selectedStudent.surname}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedStudent.code}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            {
                                                label: "UID",
                                                value: selectedStudent.uid,
                                            },
                                            {
                                                label: "Email",
                                                value: selectedStudent.email,
                                            },
                                            {
                                                label: "Phone",
                                                value: selectedStudent.phone,
                                            },
                                            {
                                                label: "Grade",
                                                value: selectedStudent.grade,
                                            },
                                            {
                                                label: "Gender",
                                                value: selectedStudent.gender,
                                            },
                                            {
                                                label: "Nationality",
                                                value: selectedStudent.nationality,
                                            },
                                            {
                                                label: "Date of Birth",
                                                value: selectedStudent.dob
                                                    ? new Date(
                                                          selectedStudent.dob
                                                      ).toLocaleDateString()
                                                    : "Not specified",
                                            },
                                            {
                                                label: "Date of Death",
                                                value: selectedStudent.dod
                                                    ? new Date(
                                                          selectedStudent.dod
                                                      ).toLocaleDateString()
                                                    : "Not specified",
                                            },
                                            {
                                                label: "ID/Passport",
                                                value: selectedStudent.id_passport,
                                            },
                                            {
                                                label: "Identification Document",
                                                value: selectedStudent.identification_document ? (
                                                    <a
                                                        href={
                                                            selectedStudent.identification_document.startsWith(
                                                                "http"
                                                            )
                                                                ? selectedStudent.identification_document
                                                                : `/storage/${selectedStudent.identification_document}`
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        View Document
                                                    </a>
                                                ) : (
                                                    "No document uploaded"
                                                ),
                                            },
                                            {
                                                label: "Street",
                                                value:
                                                    selectedStudent.street ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Postal Code",
                                                value:
                                                    selectedStudent.postal_code ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "City",
                                                value:
                                                    selectedStudent.city ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Country",
                                                value:
                                                    selectedStudent.country ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Organization",
                                                value:
                                                    selectedStudent.organization
                                                        ?.name ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Club",
                                                value:
                                                    selectedStudent.club
                                                        ?.name ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Status",
                                                value: selectedStudent.status
                                                    ? "Active"
                                                    : "Inactive",
                                            },
                                            {
                                                label: "Rating",
                                                value: (
                                                    <div className="flex items-center gap-2">
                                                        <RatingStars
                                                            rating={
                                                                typeof selectedStudent.average_rating ===
                                                                "number"
                                                                    ? Math.round(
                                                                          selectedStudent.average_rating
                                                                      )
                                                                    : 0
                                                            }
                                                            readonly
                                                            size="sm"
                                                        />
                                                        <span className="text-sm text-muted-foreground">
                                                            {typeof selectedStudent.average_rating ===
                                                            "number"
                                                                ? selectedStudent.average_rating.toFixed(
                                                                      1
                                                                  )
                                                                : "0.0"}{" "}
                                                            (
                                                            {
                                                                selectedStudent.total_ratings
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

                {/* Change Password Modal */}
                {passwordChangeStudent && (
                    <Dialog
                        open={!!passwordChangeStudent}
                        onOpenChange={(open) => {
                            if (!open) {
                                setPasswordChangeStudent(null);
                                passwordForm.reset();
                            }
                        }}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>
                                    Update password for{" "}
                                    {passwordChangeStudent.name}{" "}
                                    {passwordChangeStudent.surname}
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    passwordForm.patch(
                                        route(
                                            "admin.students.updatePassword",
                                            passwordChangeStudent.id
                                        ),
                                        {
                                            onSuccess: () => {
                                                setPasswordChangeStudent(null);
                                                passwordForm.reset();
                                            },
                                        }
                                    );
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <Label htmlFor="password">
                                        New Password{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={passwordForm.data.password}
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {passwordForm.errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {passwordForm.errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">
                                        Confirm Password{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={
                                            passwordForm.data
                                                .password_confirmation
                                        }
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {passwordForm.errors
                                        .password_confirmation && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {
                                                passwordForm.errors
                                                    .password_confirmation
                                            }
                                        </p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setPasswordChangeStudent(null);
                                            passwordForm.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                    >
                                        {passwordForm.processing
                                            ? "Updating..."
                                            : "Update Password"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
