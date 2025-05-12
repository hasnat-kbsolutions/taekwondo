import React from "react";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns, Supporter } from "@/components/columns/supporters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Props {
    supporters: Supporter[];
}

export default function Index({ supporters }: Props) {
    return (
        <AuthenticatedLayout header="Supporters">
            <Head title="Supporters" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Supporters</CardTitle>
                        <Link href={route("supporters.create")}>
                            {" "}
                            <Button>Add Supporter</Button>{" "}
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={supporters} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
