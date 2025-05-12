import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        country: "",
        city: "",
        street: "",
        postal_code: "",
        logo_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("companies.store"), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Create Company">
            <Head title="Create Company" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Company</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">
                                    Name
                                </label>
                                <Input
                                    placeholder="Name"
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
                                <label className="block text-sm mb-1">
                                    Country
                                </label>
                                <Input
                                    placeholder="Country"
                                    value={data.country}
                                    onChange={(e) =>
                                        setData("country", e.target.value)
                                    }
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm">
                                        {errors.country}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    City
                                </label>
                                <Input
                                    placeholder="City"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm">
                                        {errors.city}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    Street
                                </label>
                                <Input
                                    placeholder="Street"
                                    value={data.street}
                                    onChange={(e) =>
                                        setData("street", e.target.value)
                                    }
                                />
                                {errors.street && (
                                    <p className="text-red-500 text-sm">
                                        {errors.street}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    Postal Code
                                </label>
                                <Input
                                    placeholder="Postal Code"
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData("postal_code", e.target.value)
                                    }
                                />
                                {errors.postal_code && (
                                    <p className="text-red-500 text-sm">
                                        {errors.postal_code}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">
                                    Logo Image
                                </label>
                                <Input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "logo_image",
                                            e.target.files?.[0] || null
                                        )
                                    }
                                />
                                {errors.logo_image && (
                                    <p className="text-red-500 text-sm">
                                        {errors.logo_image}
                                    </p>
                                )}
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
