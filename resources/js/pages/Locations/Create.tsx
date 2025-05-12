import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        post(route("locations.store"));
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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
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
                                <Input
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
