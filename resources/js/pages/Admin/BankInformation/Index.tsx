import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface BankInformation {
    id: number;
    bank_name: string;
    account_name: string;
    account_number: string;
    iban?: string;
    swift_code?: string;
    branch?: string;
    currency: string;
    userable_type: string;
    userable_id: number;
    userable?: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
}

interface Admin {
    id: number;
    name: string;
}

interface Props {
    bankInformations: BankInformation[];
    organizations: Organization[];
    clubs: Club[];
    admins: Admin[];
    filters: {
        userable_type?: string;
        userable_id?: string;
        search?: string;
    };
}

const columns: ColumnDef<BankInformation>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Bank Name", accessorKey: "bank_name" },
    { header: "Account Name", accessorKey: "account_name" },
    { header: "Account Number", accessorKey: "account_number" },
    { header: "Currency", accessorKey: "currency" },
    {
        header: "Owner",
        cell: ({ row }) => {
            const bankInfo = row.original;
            const ownerType = bankInfo.userable_type
                .split("\\")
                .pop()
                ?.toLowerCase();
            return (
                <div>
                    <div className="font-medium">
                        {bankInfo.userable?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                        {ownerType}
                    </div>
                </div>
            );
        },
    },
    {
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <Link
                    href={route("admin.bank-information.edit", row.original.id)}
                >
                    <Button size="sm" variant="outline">
                        Edit
                    </Button>
                </Link>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                        if (
                            confirm(
                                "Are you sure you want to delete this bank information?"
                            )
                        ) {
                            router.delete(
                                route(
                                    "admin.bank-information.destroy",
                                    row.original.id
                                )
                            );
                        }
                    }}
                >
                    Delete
                </Button>
            </div>
        ),
    },
];

export default function Index({
    bankInformations,
    organizations,
    clubs,
    admins,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [userableType, setUserableType] = useState(
        filters.userable_type || "all"
    );
    const [userableId, setUserableId] = useState(filters.userable_id || "all");

    const handleFilter = () => {
        router.get(
            route("admin.bank-information.index"),
            {
                search: search || undefined,
                userable_type:
                    userableType === "all"
                        ? undefined
                        : userableType || undefined,
                userable_id:
                    userableId === "all" ? undefined : userableId || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setUserableType("all");
        setUserableId("all");
        router.get(
            route("admin.bank-information.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const getOptionsForType = () => {
        switch (userableType) {
            case "App\\Models\\Organization":
                return organizations;
            case "App\\Models\\Club":
                return clubs;
            case "App\\Models\\User":
                return admins;
            default:
                return [];
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bank Information" />
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Bank Information</h1>
                    <Link href={route("admin.bank-information.create")}>
                        <Button>Add Bank Information</Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    placeholder="Search by bank name, account name, or account number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="userable_type">
                                    Owner Type
                                </Label>
                                <Select
                                    value={userableType}
                                    onValueChange={setUserableType}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select owner type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="App\Models\Organization">
                                            Organization
                                        </SelectItem>
                                        <SelectItem value="App\Models\Club">
                                            Club
                                        </SelectItem>
                                        <SelectItem value="App\Models\User">
                                            Admin
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="userable_id">Owner</Label>
                                <Select
                                    value={userableId}
                                    onValueChange={setUserableId}
                                    disabled={
                                        !userableType || userableType === "all"
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select owner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Owners
                                        </SelectItem>
                                        {getOptionsForType().map((option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={option.id.toString()}
                                            >
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end space-x-2">
                                <Button onClick={handleFilter}>Filter</Button>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <DataTable columns={columns} data={bankInformations} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
