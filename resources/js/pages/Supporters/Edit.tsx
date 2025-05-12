import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Props {
    supporter: any;
    companies: any[];
    organizations: any[];
    clubs: any[];
}

export default function Edit({
    supporter,
    companies,
    organizations,
    clubs,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        company_id: supporter.company_id || "",
        country: supporter.country || "",
        organization_id: supporter.organization_id || "",
        club_id: supporter.club_id || "",
        name: supporter.name || "",
        surename: supporter.surename || "",
        gender: supporter.gender || "",
        email: supporter.email || "",
        phone: supporter.phone || "",
        type: supporter.type || "",
        status: supporter.status || false,
        profile_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("supporters.update", supporter.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Edit Supporter">
            <Head title="Edit Supporter" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Supporter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <select
                                    value={data.company_id}
                                    onChange={(e) =>
                                        setData("company_id", e.target.value)
                                    }
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">Select Company</option>
                                    {companies.map((company) => (
                                        <option
                                            key={company.id}
                                            value={company.id}
                                        >
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.company_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.company_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <select
                                    value={data.organization_id}
                                    onChange={(e) =>
                                        setData(
                                            "organization_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">
                                        Select Organization
                                    </option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.organization_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.organization_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <select
                                    value={data.club_id}
                                    onChange={(e) =>
                                        setData("club_id", e.target.value)
                                    }
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">Select Club</option>
                                    {clubs.map((club) => (
                                        <option key={club.id} value={club.id}>
                                            {club.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.club_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.club_id}
                                    </p>
                                )}
                            </div>
                            <Input
                                placeholder="Name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <Input
                                placeholder="Surename"
                                value={data.surename}
                                onChange={(e) =>
                                    setData("surename", e.target.value)
                                }
                            />
                            <Input
                                placeholder="Country"
                                value={data.country}
                                onChange={(e) =>
                                    setData("country", e.target.value)
                                }
                            />
                            <Input
                                placeholder="Gender"
                                value={data.gender}
                                onChange={(e) =>
                                    setData("gender", e.target.value)
                                }
                            />
                            <Input
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <Input
                                placeholder="Phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                            <Input
                                placeholder="Type"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                            />
                            <Input
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        "profile_image",
                                        e.target.files?.[0] ?? null
                                    )
                                }
                            />
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
