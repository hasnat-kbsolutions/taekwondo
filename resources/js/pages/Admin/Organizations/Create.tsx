import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

// Define form data keys
type OrgFormFields =
    | "name"
    | "email"
    | "phone"
    | "website"
    | "skype"
    | "city"
    | "country"
    | "street"
    | "postal_code";

type OrgFormData = {
    [K in OrgFormFields]: string;
} & { status: boolean };

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<OrgFormData>({
        name: "",
        email: "",
        phone: "",
        website: "",
        skype: "",
        city: "",
        country: "",
        street: "",
        postal_code: "",
        status: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.organizations.store"));
    };

    const fields: { id: OrgFormFields; label: string; type: string }[] = [
        { id: "name", label: "Name", type: "text" },
        { id: "email", label: "Email", type: "email" },
        { id: "phone", label: "Phone", type: "text" },
        { id: "website", label: "Website", type: "text" },
        { id: "skype", label: "Skype", type: "text" },
        { id: "city", label: "City", type: "text" },
        { id: "country", label: "Country", type: "text" },
        { id: "street", label: "Street", type: "text" },
        { id: "postal_code", label: "Postal Code", type: "text" },
    ];

    return (
        <AuthenticatedLayout header="Create Ahli Gabungan">
            <Head title="Create Organization" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Organization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map(({ id, label, type }) => (
                                <div key={id}>
                                    <Label
                                        htmlFor={id}
                                        className="block text-sm mb-1"
                                    >
                                        {label}
                                    </Label>
                                    <Input
                                        id={id}
                                        type={type}
                                        value={data[id]}
                                        onChange={(e) =>
                                            setData(id, e.target.value)
                                        }
                                    />
                                    {errors[id] && (
                                        <p className="text-red-500 text-sm">
                                            {errors[id]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-end">
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
