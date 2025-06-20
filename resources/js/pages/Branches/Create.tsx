import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        post(route("branches.store"), {
            forceFormData: true,
        });
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
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[50%] px-2">
                                <Label className="block text-sm mb-1">
                                    Name
                                </Label>
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

                            <div className="w-[50%] px-2">
                                <Label className="block text-sm mb-1">
                                    Country
                                </Label>
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

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    City
                                </Label>
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

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Street
                                </Label>
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

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Postal Code
                                </Label>
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

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Logo Image
                                </Label>
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

                            <div className="w-full px-2 mt-3">
                                <Button type="submit" disabled={processing}>
                                    Create
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
