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
        description: "",
        longitude: "",
        latitude: "",
        images: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.locations.store"));
    };

    return (
        <AuthenticatedLayout header="Create Location">
            <Head title="Create Location" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[50%] px-2">
                                <Label> Name </Label>
                                <Input
                                    type="text"
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
                                <Label> Description </Label>
                                <Input
                                    type="text"
                                    placeholder="Description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                            <div className="w-[50%] px-2 mt-3">
                                <Label> Longitude </Label>
                                <Input
                                    type="number"
                                    placeholder="Longitude"
                                    value={data.longitude}
                                    onChange={(e) =>
                                        setData("longitude", e.target.value)
                                    }
                                />
                                {errors.longitude && (
                                    <p className="text-red-500 text-sm">
                                        {errors.longitude}
                                    </p>
                                )}
                            </div>
                            <div className="w-[50%] px-2 mt-3">
                                <Label> Latitude </Label>
                                <Input
                                    type="number"
                                    placeholder="Latitude"
                                    value={data.latitude}
                                    onChange={(e) =>
                                        setData("latitude", e.target.value)
                                    }
                                />
                                {errors.latitude && (
                                    <p className="text-red-500 text-sm">
                                        {errors.latitude}
                                    </p>
                                )}
                            </div>
                            <div className="w-full px-2 mt-3">
                                <Label> Files </Label>
                                <Input
                                    type="file"
                                    multiple
                                    onChange={(e) =>
                                        setData(
                                            "images",
                                            Array.from(e.target.files || [])
                                        )
                                    }
                                />
                                {errors.images && (
                                    <p className="text-red-500 text-sm">
                                        {errors.images}
                                    </p>
                                )}
                            </div>

                            <div className="w-full px-2 mt-3">
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
