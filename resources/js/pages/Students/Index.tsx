import React from "react";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns, Student } from "@/components/columns/students";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Props {
    students: Student[];
}

export default function Index({ students }: Props) {
    return (
        <AuthenticatedLayout header="Students">
            <Head title="Students" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Students</CardTitle>
                        <Link href={route("students.create")}>
                            {" "}
                            <Button>Add Student</Button>{" "}
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={students} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
