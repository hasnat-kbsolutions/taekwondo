import React, { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PageProps } from "@/types"; // We'll define this below
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    user?: User;
}

interface Props {
    clubs: Club[];
    filters: {
        country?: string;
    };
}

const columns: ColumnDef<Club>[] = [
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
                        <Link href={route("organization.clubs.edit", row.original.id)}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("organization.clubs.destroy", row.original.id)}
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

export default function Index({ clubs, filters }: Props) {

  
    const [country, setCountry] = useState(filters.country || "");

    const handleFilterChange = (extraParams = {}) => {
        router.get(
            route("organization.clubs.index"),
            {
                ...extraParams,
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
        setCountry("");
        router.get(
            route("organization.clubs.index"),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

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
                                <Label className="text-sm mb-1">Country</Label>
                                <CountryDropdown
                                    placeholder="All Countries"
                                    defaultValue={country || ""}
                                    onChange={(c) => {
                                        const selected = c?.alpha3 || "";
                                        setCountry(selected);
                                        router.get(
                                            route("organization.clubs.index"),
                                            {
                                                country:
                                                    typeof selected === "string"
                                                        ? selected
                                                        : null,
                                            },
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                                replace: true,
                                            }
                                        );
                                    }}
                                    slim={false}
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    className="flex flex-wrap items-center gap-2 md:flex-row bg-primary text-background"
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
                        <Link href={route("organization.clubs.create")}>
                            {" "}
                            <Button>Add Club</Button>{" "}
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={clubs} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
