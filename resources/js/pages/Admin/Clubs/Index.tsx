import React, { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PageProps } from "@/types"; // We'll define this below

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner"; // or any toast lib
import { CountryDropdown } from "@/components/ui/country-dropdown";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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


const columns: ColumnDef<Club>[] = [
    {
        header: "ID",
        accessorKey: "id",
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

export default function Index({
    clubs,
    organizations = [],
    filters,
    
}: Props) {
    // Use correct typing
    const { props } = usePage<PageProps>();
    const success = props.flash?.success;

    useEffect(() => {
        if (success) {
            console.log("Flash success:", success);
            toast.success(success);
        }
    }, [success]);
    

    const error = props.flash?.error;

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

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

    return (
        <AuthenticatedLayout header="Cawangan">
            <Head title="Clubs" />
            <div className="p-4 space-y-6">
                {/* Filters */}
                <div className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col w-[200px]">
                        <Label className="text-sm mb-1">Organizations</Label>
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
                        <Button variant="outline" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </div>

                {/* Header and Add Button */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Clubs</h1>
                    <Link href={route("admin.clubs.create")}>
                        <Button>Add Club</Button>
                    </Link>
                </div>

                {/* Data Table */}
                <Card>
                    <DataTable columns={columns} data={clubs} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}