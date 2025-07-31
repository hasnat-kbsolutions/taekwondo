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

const columns = (onView: (instructor: Club) => void): ColumnDef<Club>[] => [
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
                        <Link href={route("admin.clubs.edit", row.original.id)}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("admin.clubs.destroy", row.original.id)}
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
                                    className="flex flex-wrap items-center gap-2 md:flex-row bg-primary text-white dark:text-black"
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
                        <DialogContent className="w-full h-auto">
                            <div className=" flex justify-between items-center ">
                                <div className="block">
                                    <DialogTitle className="text-3xl text-foreground  text-left">
                                        Club Details
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-200 text-foreground ml-2">
                                        Full club details
                                    </DialogDescription>
                                </div>
                                <div className="block">
                                    <div className="mt-1 justify-center flex  bg-foreground  w-24 h-24 border rounded-full text-center items-center">
                                        {selectedClub.logo ? (
                                            <img
                                                src={selectedClub.logo}
                                                alt="Club Logo"
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="italic text-muted-foreground ">
                                                No image
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                {[
                                    {
                                        label: "Club Name",
                                        value: selectedClub.name,
                                    },
                                    {
                                        label: "City",
                                        value: selectedClub.city || "-",
                                    },
                                    {
                                        label: "Country",
                                        value: selectedClub.country || "-",
                                    },
                                    {
                                        label: "Phone",
                                        value: selectedClub.phone || "-",
                                    },
                                    {
                                        label: "Tax Number",
                                        value: selectedClub.tax_number || "-",
                                    },
                                    {
                                        label: "Invoice Prefix",
                                        value:
                                            selectedClub.invoice_prefix || "-",
                                    },
                                    {
                                        label: "Organization",
                                        value:
                                            selectedClub.organization?.name ||
                                            "-",
                                    },
                                    {
                                        label: "User Name",
                                        value: selectedClub.user?.name || "-",
                                    },
                                    {
                                        label: "User Email",
                                        value: selectedClub.user?.email || "-",
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between"
                                    >
                                        <span className="text-foreground  text-base font-semibold">
                                            {item.label}:
                                        </span>
                                        <span className="text-foreground text-sm text-right max-w-[60%] break-words">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}

                                {/* Status badge row */}
                                <div className="flex justify-between items-center">
                                    <span className="text-foreground text-base font-semibold">
                                        Status:
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                                            selectedClub.status
                                                ? "bg-green-600 text-white"
                                                : "bg-red-600 text-white"
                                        }`}
                                    >
                                        {selectedClub.status
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
