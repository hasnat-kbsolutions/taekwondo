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
import { MoreHorizontal, FileText, Eye, Filter, X } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Certification {
    id: number;
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
                certification.notes
                    ?.toLowerCase()
                    .includes(localFilters.search.toLowerCase());

            return matchesSearch;
        });
    }, [certifications, localFilters]);

    const applyFilters = (filters: any) => {
        const filterParams = {
            search: filters.search,
        };

        router.get(route("student.certifications.index"), filterParams, {
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
            route("student.certifications.index"),
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
        {
            header: "Issued Date",
            cell: ({ row }) => (
                <span>
                    {row.original.issued_at
                        ? new Date(row.original.issued_at).toLocaleDateString()
                        : "Not specified"}
                </span>
            ),
        },
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
        {
            header: "Notes",
            cell: ({ row }) => (
                <span
                    className="max-w-xs truncate"
                    title={row.original.notes || ""}
                >
                    {row.original.notes || "No notes"}
                </span>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <a
                                href={`/storage/${row.original.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View Certificate
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AuthenticatedLayout header="My Certifications">
            <Head title="My Certifications" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>
                                    My Certifications (
                                    {filteredCertifications.length})
                                </CardTitle>
                                <p className="text-muted-foreground text-sm mt-1">
                                    View all your certifications and
                                    certificates.
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="mb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        Filters:
                                    </Label>
                                </div>
                                <div className="flex-1 max-w-sm">
                                    <Input
                                        placeholder="Search by notes..."
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
                                {localFilters.search && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* DataTable */}
                        <DataTable
                            columns={columns}
                            data={filteredCertifications}
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default CertificationsIndex;
