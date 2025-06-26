import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";


interface Role {
    id: number;
    name: string;
    permissions: { id: number; name: string }[];
}

interface Props {
    role: Role;
    permissions: { id: number; name: string }[];
}

export default function EditRole({ role, permissions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
    });

    const togglePermission = (id: number) => {
        setData(
            "permissions",
            data.permissions.includes(id)
                ? data.permissions.filter((p) => p !== id)
                : [...data.permissions, id]
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("roles.update", role.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Role" />
            <form onSubmit={submit} className="p-4 space-y-4 max-w-xl">
                <h1 className="text-2xl font-bold">Edit Role</h1>

                <Input
                    placeholder="Name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                )}

                <div className="space-y-1">
                    <label className="font-medium">Permissions</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {permissions.map((perm) => (
                            <label
                                key={perm.id}
                                className="flex items-center gap-2"
                            >
                                <Checkbox
                                    checked={data.permissions.includes(perm.id)}
                                    onCheckedChange={() =>
                                        togglePermission(perm.id)
                                    }
                                />
                                {perm.name}
                            </label>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={processing}>
                    Update
                </Button>
            </form>
        </AuthenticatedLayout>
    );
}
