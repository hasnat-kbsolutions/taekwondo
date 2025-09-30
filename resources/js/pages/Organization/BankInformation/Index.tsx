import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Props {
    bankInformations: BankInformation[];
    filters: {
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
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <Link
                    href={route(
                        "organization.bank-information.edit",
                        row.original.id
                    )}
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
                                    "organization.bank-information.destroy",
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

export default function Index({ bankInformations, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");

    const handleFilter = () => {
        router.get(
            route("organization.bank-information.index"),
            {
                search: search || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        router.get(
            route("organization.bank-information.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bank Information" />
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Bank Information</h1>
                    <Link href={route("organization.bank-information.create")}>
                        <Button>Add Bank Information</Button>
                    </Link>
                </div>

                {/* Search */}
                <Card>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    placeholder="Search by bank name, account name, or account number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end space-x-2">
                                <Button onClick={handleFilter}>Search</Button>
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
