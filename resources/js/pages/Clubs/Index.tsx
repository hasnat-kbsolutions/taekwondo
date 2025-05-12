import React from "react";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns, Club } from "@/components/columns/clubs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Props {
    clubs: Club[];
}

export default function Index({ clubs }: Props) {
    return (
        <AuthenticatedLayout header="Clubs">
            <Head title="Clubs" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Clubs</CardTitle>
                        <Link href={route("clubs.create")}>
                            <Button>Add Club</Button>
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
