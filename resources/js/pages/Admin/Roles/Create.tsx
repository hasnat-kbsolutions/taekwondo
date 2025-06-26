import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
    permissions: { id: number; name: string }[];
}

export default function CreateRole({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        permissions: [] as number[],
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
        post(route("admin.roles.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Role" />
            <form onSubmit={submit} className="p-4 space-y-4 max-w-xl">
                <h1 className="text-2xl font-bold">Create Role</h1>

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
                    Save
                </Button>
            </form>
        </AuthenticatedLayout>
    );
}
