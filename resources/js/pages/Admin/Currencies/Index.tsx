import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    PlusIcon,
    Pencil1Icon,
    TrashIcon,
    EyeOpenIcon,
    EyeClosedIcon,
    StarIcon,
} from "@radix-ui/react-icons";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";

interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    decimal_places: number;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
}

interface Props {
    currencies: Currency[];
}

export default function Index({ currencies }: Props) {
    const handleToggleActive = (currency: Currency) => {
        router.patch(route("admin.currencies.toggle-active", currency.id));
    };

    const handleSetDefault = (currency: Currency) => {
        router.patch(route("admin.currencies.set-default", currency.id));
    };

    const handleDelete = (currency: Currency) => {
        if (confirm(`Are you sure you want to delete ${currency.name}?`)) {
            router.delete(route("admin.currencies.destroy", currency.id));
        }
    };

    return (
        <AuthenticatedLayout header="Currency Management">
            <Head title="Currencies" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Currencies
                        </h2>
                        <Link href={route("admin.currencies.create")}>
                            <Button>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Currency
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Manage System Currencies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns({
                                    onToggleActive: handleToggleActive,
                                    onSetDefault: handleSetDefault,
                                    onDelete: handleDelete,
                                })}
                                data={currencies}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
