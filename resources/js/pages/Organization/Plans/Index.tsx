import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Index() {
    const { plans = [], clubs = [], filters = {} } = usePage().props as any;

    const [clubFilter, setClubFilter] = useState(
        filters?.club_id ? String(filters.club_id) : "all"
    );

    const handleFilter = () => {
        router.get(route("organization.plans.index"), {
            club_id: clubFilter && clubFilter !== "all" ? clubFilter : null,
        });
    };

    const clearFilter = () => {
        setClubFilter("all");
        router.get(route("organization.plans.index"));
    };

    return (
        <AuthenticatedLayout header="Plans">
            <Head title="Plans" />
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Plans</h2>
                    <Link href={route("organization.plans.create")}>
                        <Button>Create Plan</Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 items-end">
                            <div>
                                <Label>Club</Label>
                                <Select
                                    value={clubFilter}
                                    onValueChange={setClubFilter}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Clubs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Clubs
                                        </SelectItem>
                                        {clubs.map((club: any) => (
                                            <SelectItem
                                                key={club.id}
                                                value={String(club.id)}
                                            >
                                                {club.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleFilter}>Filter</Button>
                                <Button variant="outline" onClick={clearFilter}>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>All Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="py-2 pr-4">Name</th>
                                        <th className="py-2 pr-4">Club</th>
                                        <th className="py-2 pr-4">Amount</th>
                                        <th className="py-2 pr-4">Currency</th>
                                        <th className="py-2 pr-4">Active</th>
                                        <th className="py-2 pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.map((p: any) => (
                                        <tr
                                            key={p.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2 pr-4">
                                                {p.name}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {p.planable?.name || "-"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {p.base_amount}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {p.currency_code}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {p.is_active ? "Yes" : "No"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                <Link
                                                    href={route(
                                                        "organization.plans.edit",
                                                        p.id
                                                    )}
                                                    className="text-primary underline"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {plans.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-4 text-muted-foreground"
                                            >
                                                No plans found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
