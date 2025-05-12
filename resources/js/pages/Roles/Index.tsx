import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card } from "@/components/ui/card";

interface Role {
    id: number;
    name: string;
    permissions: { name: string }[];
}

interface Props {
    roles: Role[];
}

export default function RoleIndex({ roles }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Roles" />
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <Link href={route("roles.create")}>
                        {" "}
                        <Button>Create Role</Button>{" "}
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                        <Card key={role.id} className="p-4">
                            <div className="font-semibold text-lg">
                                {role.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Permissions:{" "}
                                {role.permissions
                                    .map((p) => p.name)
                                    .join(", ") || "None"}
                            </div>
                            <Link href={route("roles.edit", role.id)}>
                                <Button className="mt-2" size="sm">
                                    Edit
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
