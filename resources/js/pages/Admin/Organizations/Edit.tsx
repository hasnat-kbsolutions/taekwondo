import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

// Define valid keys for input fields
type OrgField =
    | "name"
    | "email"
    | "phone"
    | "website"
    | "skype"
    | "city"
    | "country"
    | "street"
    | "postal_code";

type OrganizationFormData = {
    [K in OrgField]: string;
} & { status: boolean };

interface Organization {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    skype?: string;
    city?: string;
    country?: string;
    street?: string;
    postal_code?: string;
    status: boolean;
}

interface Props {
    organization: Organization;
}

export default function Edit({ organization }: Props) {
    const { data, setData, put, processing, errors } =
        useForm<OrganizationFormData>({
            name: organization.name || "",
            email: organization.email || "",
            phone: organization.phone || "",
            website: organization.website || "",
            skype: organization.skype || "",
            city: organization.city || "",
            country: organization.country || "",
            street: organization.street || "",
            postal_code: organization.postal_code || "",
            status: organization.status ?? true,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.organizations.update", organization.id));
    };

    const fields: { id: OrgField; label: string; type: string }[] = [
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
        <AuthenticatedLayout header="Edit Ahli Gabungan">
            <Head title="Edit Organization" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Organization</CardTitle>
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
                                    Update
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
