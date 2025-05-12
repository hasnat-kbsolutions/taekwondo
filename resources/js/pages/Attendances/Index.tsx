// resources/js/Pages/Attendances/Index.tsx

import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns/attendances";

export default function Index({
    attendances,
    companies,
    organizations,
    clubs,
    filters: defaultFilters,
}: any) {
    const [filters, setFilters] = useState({
        company_id: defaultFilters.company_id || "",
        organization_id: defaultFilters.organization_id || "",
        club_id: defaultFilters.club_id || "",
        date: defaultFilters.date || "",
    });

    useEffect(() => {
        router.get(route("attendances.index"), filters, {
            preserveState: true,
            replace: true,
        });
    }, [filters]);

    return (
        <AuthenticatedLayout header="Attendances">
            <Head title="Attendances" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <select
                                value={filters.company_id}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        company_id: e.target.value,
                                    }))
                                }
                            >
                                <option value="">All Companies</option>
                                {companies.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filters.organization_id}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        organization_id: e.target.value,
                                    }))
                                }
                            >
                                <option value="">All Organizations</option>
                                {organizations.map((o: any) => (
                                    <option key={o.id} value={o.id}>
                                        {o.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filters.club_id}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        club_id: e.target.value,
                                    }))
                                }
                            >
                                <option value="">All Clubs</option>
                                {clubs.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <Input
                                type="date"
                                value={filters.date}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        date: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <DataTable columns={columns} data={attendances} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
