import React, { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PageProps } from "@/types"; // We'll define this below
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
    city?: string;
    country?: string;
    logo?: string;
    phone?: string;
    tax_number?: string;
    invoice_prefix?: string;
    status: boolean;
    organization: Organization;
    user?: User;
}

interface Props {
    clubs: Club[];
    organizations?: Organization[]; // optional
    filters: {
        organization_id?: string;
        country?: string;
    };
}

const columns = (
    onView: (instructor: Club) => void
): ColumnDef<Club>[] => [

    
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },

    {
        header: "Logo",
        cell: ({ row }) =>
            row.original.logo ? (
                <img
                    src={row.original.logo}
                    alt="Club Logo"
                    className="w-10 h-10 object-cover rounded"
                />
            ) : (
                "-"
            ),
    },
    {
        header: "User Name",
        cell: ({ row }) => row.original.user?.name ?? "-",
    },
    {
        header: "City",
        accessorKey: "city",
    },
    {
        header: "Country",
        accessorKey: "country",
    },
    {
        header: "Phone",
        accessorKey: "phone",
    },
    {
        header: "Tax No.",
        accessorKey: "tax_number",
    },
    {
        header: "Invoice Prefix",
        accessorKey: "invoice_prefix",
    },
    {
        header: "Organization",
        cell: ({ row }) => row.original.organization?.name ?? "-",
    },
    {
        header: "Email",
        cell: ({ row }) => row.original.user?.email ?? "-",
    },
    {
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status ? "default" : "destructive"}>
                {row.original.status ? "Active" : "Inactive"}
            </Badge>
        ),
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
                    <DropdownMenuItem onClick={() => onView(row.original)}>
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "admin.clubs.edit",
                                row.original.id
                            )}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(
                                "admin.clubs.destroy",
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

export default function Index({ clubs, organizations = [], filters }: Props) {

    const [organizationId, setOrganizationId] = useState(
        filters.organization_id || ""
    );
    const [country, setCountry] = useState(filters.country || "");

    const handleFilterChange = (extraParams = {}) => {
        router.get(
            route("admin.clubs.index"),
            {
                ...extraParams,
                organization_id: organizationId || null,
                country: country || null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setOrganizationId("");
        setCountry("");
        router.get(
            route("admin.clubs.index"),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };
const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    return (
        <AuthenticatedLayout header="Clubs">
            <Head title="Organizations" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap ">
                            <div className="flex flex-col w-[200px]">
                                <Label className="text-sm mb-1">
                                    Organizations
                                </Label>
                                <Select
                                    value={organizationId || ""}
                                    onValueChange={(val) => {
                                        setOrganizationId(val);
                                        handleFilterChange({ country });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Organizations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {organizations.map((org) => (
                                            <SelectItem
                                                key={org.id}
                                                value={org.id.toString()}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col w-[200px]">
                                <Label className="text-sm mb-1">Country</Label>
                                <CountryDropdown
                                    placeholder="All Countries"
                                    defaultValue={country || ""}
                                    onChange={(c) => {
                                        const selected = c?.alpha3 || "";
                                        setCountry(selected);
                                        handleFilterChange({
                                            organization_id: organizationId,
                                        });
                                    }}
                                    slim={false}
                                />
                            </div>

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
            </div>
            <div className="container mx-auto ">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Clubs</CardTitle>
                        <Link href={route("admin.clubs.create")}>
                            {" "}
                            <Button>Add Club</Button>{" "}
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns((clubs) => setSelectedClub(clubs))}
                            data={clubs}
                        />
                    </CardContent>
                </Card>
                {selectedClub && (
                    <Dialog
                        open={!!selectedClub}
                        onOpenChange={(open) => {
                            if (!open) setSelectedClub(null);
                        }}
                    >
                        <DialogContent>
                            <DialogTitle>Club Details</DialogTitle>
                            <DialogDescription>
                                Full club details
                            </DialogDescription>

                            <div className="relative grid grid-cols-2 gap-4 text-sm before:absolute before:top-0 before:bottom-0 before:left-1/2 before:w-px before:bg-gray-200">
                                {/* Left Column */}
                                <div className="space-y-2 pr-4">
                                    <div>
                                        <strong>Club Name:</strong>{" "}
                                        {selectedClub.name}
                                    </div>
                                    <div>
                                        <strong>City:</strong>{" "}
                                        {selectedClub.city || "-"}
                                    </div>
                                    <div>
                                        <strong>Country:</strong>{" "}
                                        {selectedClub.country || "-"}
                                    </div>
                                    <div>
                                        <strong>Phone:</strong>{" "}
                                        {selectedClub.phone || "-"}
                                    </div>
                                    <div>
                                        <strong>Tax Number:</strong>{" "}
                                        {selectedClub.tax_number || "-"}
                                    </div>
                                    <div>
                                        <strong>Invoice Prefix:</strong>{" "}
                                        {selectedClub.invoice_prefix || "-"}
                                    </div>
                                    <div>
                                        <strong>Organization:</strong>{" "}
                                        {selectedClub.organization?.name || "-"}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-2 pl-4">
                                    <div>
                                        <strong>User Name:</strong>{" "}
                                        {selectedClub.user?.name || "-"}
                                    </div>
                                    <div>
                                        <strong>User Email:</strong>{" "}
                                        {selectedClub.user?.email || "-"}
                                    </div>
                                    <div>
                                        <strong>Status:</strong>{" "}
                                        <Badge
                                            variant={
                                                selectedClub.status
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {selectedClub.status
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </div>
                                    <div className="pt-2">
                                        <strong>Club Logo:</strong>
                                        <div className="mt-1">
                                            {selectedClub.logo ? (
                                                <img
                                                    src={selectedClub.logo}
                                                    alt="Club Logo"
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                            ) : (
                                                <span className="italic text-gray-500">
                                                    No image
                                                </span>
                                            )}
                                        </div>
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
