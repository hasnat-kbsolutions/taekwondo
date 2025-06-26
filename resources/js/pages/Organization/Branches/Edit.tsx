import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Organization {
    id: number;
    name: string;
}

interface Branch {
    id: number;
    name: string;
    email: string;
    // organization_id: number;
    city: string;
    country: string;
    street: string;
    postal_code: string;
}

interface Props {
    branch: Branch;
    // organizations: Organization[];
}

export default function Edit({ branch }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: branch.name || "",
        email: branch.email || "",
        // organization_id: branch.organization_id.toString(),
        city: branch.city || "",
        country: branch.country || "",
        street: branch.street || "",
        postal_code: branch.postal_code || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("organization.branches.update", branch.id));
    };

    return (
        <AuthenticatedLayout header="Edit Branch">
            <Head title="Edit Branch" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Branch</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    value={data.email}
                                    type="email"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* <div>
                                <Label>Organization</Label>
                                <Select
                                    value={data.organization_id}
                                    onValueChange={(value) =>
                                        setData("organization_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem
                                                key={org.id}
                                                value={org.id.toString()}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.organization_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.organization_id}
                                    </p>
                                )}
                            </div> */}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>City</Label>
                                    <Input
                                        value={data.city}
                                        onChange={(e) =>
                                            setData("city", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Country</Label>
                                    <Input
                                        value={data.country}
                                        onChange={(e) =>
                                            setData("country", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Street</Label>
                                    <Input
                                        value={data.street}
                                        onChange={(e) =>
                                            setData("street", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Postal Code</Label>
                                    <Input
                                        value={data.postal_code}
                                        onChange={(e) =>
                                            setData(
                                                "postal_code",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <Button type="submit" disabled={processing}>
                                Update
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
