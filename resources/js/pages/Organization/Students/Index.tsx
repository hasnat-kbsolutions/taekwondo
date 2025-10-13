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
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/RatingStars";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

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
    website: string;
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

// Define the columns inline here
export const columns = (
    onView: (student: Student) => void
): ColumnDef<Student>[] => [
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
    { accessorKey: "id_passport", header: "ID/Passport" },
    {
        id: "identification_document",
        header: "Documents",
        cell: ({ row }) => {
            const docUrl = row.original.identification_document;
            if (docUrl) {
                // Handle both relative paths and full URLs
                const fullUrl = docUrl.startsWith("http")
                    ? docUrl
                    : `/storage/${docUrl}`;
                return (
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                        >
                            View Doc
                        </a>
                    </div>
                );
            }
            return <span className="text-gray-400 italic text-xs">No doc</span>;
        },
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
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
        cell: ({ row }) => {
            const student = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(student)}>
                            <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "organization.students.edit",
                                    student.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "organization.students.destroy",
                                    student.id
                                )}
                                method="delete"
                                as="button"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
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
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null
    );

    const handleView = (student: Student) => {
        setSelectedStudent(student);
    };

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
                {/* Students Table Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Students</CardTitle>
                        <Link href={route("organization.students.create")}>
                            <Button>Add Student</Button>
                        </Link>
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
                            columns={columns(handleView)}
                            data={students}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* View Student Dialog */}
            <Dialog
                open={!!selectedStudent}
                onOpenChange={() => setSelectedStudent(null)}
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
                                        label: "Website",
                                        value:
                                            selectedStudent.website ||
                                            "Not specified",
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
                                    <div key={idx} className="space-y-1">
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {item.label}
                                        </Label>
                                        <div className="text-sm">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Attachments Section */}
                            <div className="border-t pt-6">
                                <h4 className="font-semibold mb-4">
                                    Attachments
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Profile Image */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Profile Image
                                        </Label>
                                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 min-h-[200px] flex items-center justify-center">
                                            {selectedStudent.profile_image ? (
                                                <img
                                                    src={
                                                        selectedStudent.profile_image.startsWith(
                                                            "http"
                                                        )
                                                            ? selectedStudent.profile_image
                                                            : `/storage/${selectedStudent.profile_image}`
                                                    }
                                                    alt="Profile"
                                                    className="max-w-full max-h-48 object-contain rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    No profile image
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Identification Document */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Identification Document
                                        </Label>
                                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 min-h-[200px] flex items-center justify-center">
                                            {selectedStudent.identification_document ? (
                                                <div className="text-center">
                                                    <FileText className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600">
                                                        PDF Document Available
                                                    </p>
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
                                                        className="text-blue-600 hover:text-blue-800 text-sm underline mt-1 inline-block"
                                                    >
                                                        View Document
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    No identification document
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
