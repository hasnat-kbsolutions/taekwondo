import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    FileText,
    Edit,
    Trash2,
    Eye,
    Filter,
    X,
} from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Certification {
    id: number;
    student_name: string;
    club_name: string;
    organization_name: string;
    file: string;
    issued_at: string | null;
    notes: string | null;
}

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
    organization_id: number;
}

interface Props {
    certifications: Certification[];
    organizations: Organization[];
    clubs: Club[];
    filters: {
        organization_id?: string;
        club_id?: string;
        search?: string;
    };
}

const CertificationsIndex: React.FC<Props> = ({
    certifications,
    organizations,
    clubs,
    filters,
}) => {
    const [localFilters, setLocalFilters] = useState({
        organization_id: filters.organization_id || "all",
        club_id: filters.club_id || "all",
        search: filters.search || "",
    });

    // Filter clubs based on selected organization
    const filteredClubs = useMemo(() => {
        if (
            !localFilters.organization_id ||
            localFilters.organization_id === "all"
        )
            return clubs;
        return clubs.filter(
            (club) =>
                club.organization_id.toString() === localFilters.organization_id
        );
    }, [clubs, localFilters.organization_id]);

    // Filter certifications based on local filters
    const filteredCertifications = useMemo(() => {
        return certifications.filter((certification) => {
            const matchesSearch =
                !localFilters.search ||
                certification.student_name
                    .toLowerCase()
                    .includes(localFilters.search.toLowerCase()) ||
                certification.club_name
                    .toLowerCase()
                    .includes(localFilters.search.toLowerCase()) ||
                certification.organization_name
                    .toLowerCase()
                    .includes(localFilters.search.toLowerCase());

            const matchesOrganization =
                !localFilters.organization_id ||
                localFilters.organization_id === "all" ||
                certification.organization_name ===
                    organizations.find(
                        (org) =>
                            org.id.toString() === localFilters.organization_id
                    )?.name;

            const matchesClub =
                !localFilters.club_id ||
                localFilters.club_id === "all" ||
                certification.club_name ===
                    clubs.find(
                        (club) => club.id.toString() === localFilters.club_id
                    )?.name;

            return matchesSearch && matchesOrganization && matchesClub;
        });
    }, [certifications, localFilters, organizations, clubs]);

    const applyFilters = (filters: any) => {
        const filterParams = {
            organization_id:
                filters.organization_id === "all"
                    ? ""
                    : filters.organization_id,
            club_id: filters.club_id === "all" ? "" : filters.club_id,
            search: filters.search,
        };

        router.get(route("admin.certifications.index"), filterParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            organization_id: "all",
            club_id: "all",
            search: "",
        };
        setLocalFilters(clearedFilters);
        router.get(
            route("admin.certifications.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // DataTable columns
    const columns: ColumnDef<Certification>[] = [
        {
            header: "#",
            cell: ({ row }) => row.index + 1,
        },
        { header: "Student", accessorKey: "student_name" },
        { header: "Club", accessorKey: "club_name" },
        { header: "Organization", accessorKey: "organization_name" },
        {
            header: "File",
            cell: ({ row }) => (
                <a
                    href={`/storage/${row.original.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white flex items-center transition-colors"
                >
                    <FileText className="w-4 h-4 mr-1" />
                    View
                </a>
            ),
        },
        { header: "Issued At", accessorKey: "issued_at" },
        { header: "Notes", accessorKey: "notes" },
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
                                    "admin.certifications.edit",
                                    row.original.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.certifications.destroy",
                                    row.original.id
                                )}
                                method="delete"
                                as="button"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a
                                href={`/storage/${row.original.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Eye className="w-4 h-4 mr-2" /> View
                                Certification File
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AuthenticatedLayout header="Certifications">
            <Head title="Certifications" />
            <div className="container mx-auto py-10">
                {/* Certifications Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            Certifications ({filteredCertifications.length})
                        </CardTitle>
                        <Link href={route("admin.certifications.create")}>
                            <Button>Add Certification</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Label htmlFor="search">Search</Label>
                                    <Input
                                        id="search"
                                        placeholder="Search students, clubs, organizations..."
                                        value={localFilters.search}
                                        onChange={(e) => {
                                            const newFilters = {
                                                ...localFilters,
                                                search: e.target.value,
                                            };
                                            setLocalFilters(newFilters);
                                            applyFilters(newFilters);
                                        }}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="organization">
                                        Organization
                                    </Label>
                                    <Select
                                        value={
                                            localFilters.organization_id ||
                                            "all"
                                        }
                                        onValueChange={(value) => {
                                            const newFilters = {
                                                ...localFilters,
                                                organization_id:
                                                    value === "all"
                                                        ? ""
                                                        : value,
                                                club_id: "", // Reset club when organization changes
                                            };
                                            setLocalFilters(newFilters);
                                            applyFilters(newFilters);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Organizations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Organizations
                                            </SelectItem>
                                            {organizations.map(
                                                (organization) => (
                                                    <SelectItem
                                                        key={organization.id}
                                                        value={organization.id.toString()}
                                                    >
                                                        {organization.name}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="club">Club</Label>
                                    <Select
                                        value={localFilters.club_id || "all"}
                                        onValueChange={(value) => {
                                            const newFilters = {
                                                ...localFilters,
                                                club_id:
                                                    value === "all"
                                                        ? ""
                                                        : value,
                                            };
                                            setLocalFilters(newFilters);
                                            applyFilters(newFilters);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Clubs" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Clubs
                                            </SelectItem>
                                            {filteredClubs.map((club) => (
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

                                <div className="flex items-end gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={clearFilters}
                                        className="w-full"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* DataTable */}
                        <DataTable
                            data={filteredCertifications}
                            columns={columns}
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default CertificationsIndex;
