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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Certification {
    id: number;
    student_name: string;
    file: string;
    issued_at: string | null;
    notes: string | null;
}

interface Props {
    certifications: Certification[];
    filters: {
        search?: string;
    };
}

const CertificationsIndex: React.FC<Props> = ({ certifications, filters }) => {
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || "",
    });

    // Filter certifications based on local filters
    const filteredCertifications = useMemo(() => {
        return certifications.filter((certification) => {
            const matchesSearch =
                !localFilters.search ||
                certification.student_name
                    .toLowerCase()
                    .includes(localFilters.search.toLowerCase());

            return matchesSearch;
        });
    }, [certifications, localFilters]);

    const applyFilters = (filters: any) => {
        const filterParams = {
            search: filters.search,
        };

        router.get(route("club.certifications.index"), filterParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: "",
        };
        setLocalFilters(clearedFilters);
        router.get(
            route("club.certifications.index"),
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
                                    "club.certifications.edit",
                                    row.original.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "club.certifications.destroy",
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
            <div className="container mx-auto py-10 space-y-6">
                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    placeholder="Search students..."
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

                            <div className="flex items-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="w-full"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Certifications Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            Certifications ({filteredCertifications.length})
                        </CardTitle>
                        <Link href={route("club.certifications.create")}>
                            <Button>Add Certification</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
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
