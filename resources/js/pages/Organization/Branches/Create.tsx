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

// interface Props {
//     organizations: Organization[];
// }

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        // organization_id: "",
        city: "",
        country: "",
        street: "",
        postal_code: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("organization.branches.store"));
    };

    return (
        <AuthenticatedLayout header="Create Branch">
            <Head title="Create Branch" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Branch</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    placeholder="Branch Name"
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
                                    placeholder="Email for login"
                                    type="email"
                                    value={data.email}
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
                                Create
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
