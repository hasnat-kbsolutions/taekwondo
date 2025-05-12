import React from "react";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns, Location } from "@/components/columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Props {
    locations: Location[];
}

export default function Index({ locations }: Props) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Locations" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Locations</CardTitle>
                        <Link href={route("locations.create")}>
                            <Button>Add Location</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={locations} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
