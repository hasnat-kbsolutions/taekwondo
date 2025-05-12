import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Location } from "@/components/columns";
import AuthenticatedLayout from "@/layouts/authenticated-layout";


interface Props {
    location: Location;
}

export default function Edit({ location }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: location.name,
        description: location.description || "",
        longitude: location.longitude.toString(),
        latitude: location.latitude.toString(),
        images: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("locations.update", location.id));
    };

    return (
        <AuthenticatedLayout header="Edit Location">
            <Head title="Edit Location" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Location</CardTitle>
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
                                Update
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
