import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { CountryDropdown } from "@/components/ui/country-dropdown";

interface Props {
    clubs: any[];
    organizations: any[];
}

export default function Create({ clubs, organizations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        club_id: "",
        organization_id: "",
        name: "",
        surename: "",
        gender: "",
        email: "",
        phone: "",
        type: "",
        country: "",
        status: false,
        profile_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.supporters.store"), { forceFormData: true });
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Create Supporter">
            <Head title="Create Supporter" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Supporter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-2 gap-4"
                        >
                            {/* Club */}
                            <div>
                                <Label>
                                    Club <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.club_id}
                                    onValueChange={(value) =>
                                        setData("club_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Club" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clubs.map((club) => (
                                            <SelectItem
                                                key={club.id}
                                                value={String(club.id)}
                                            >
                                                {club.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {renderError("club_id")}
                            </div>

                            {/* Organization */}
                            <div>
                                <Label>
                                    Organization{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
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
                                                value={String(org.id)}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {renderError("organization_id")}
                            </div>

                            {/* Name */}
                            <div>
                                <Label>
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Name"
                                />
                                {renderError("name")}
                            </div>

                            {/* Surename */}
                            <div>
                                <Label>Surname</Label>
                                <Input
                                    value={data.surename}
                                    onChange={(e) =>
                                        setData("surename", e.target.value)
                                    }
                                    placeholder="Surname"
                                />
                                {renderError("surename")}
                            </div>

                            {/* Country */}
                            <div>
                                <Label>Country</Label>
                                <CountryDropdown
                                    placeholder="Select country"
                                    defaultValue={data.country}
                                    onChange={(c) =>
                                        setData("country", c.alpha3)
                                    }
                                    slim={false}
                                />
                                {renderError("country")}
                            </div>

                            {/* Gender */}
                            <div>
                                <Label>
                                    Gender{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) =>
                                        setData("gender", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {renderError("gender")}
                            </div>

                            {/* Email */}
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="Email"
                                />
                                {renderError("email")}
                            </div>

                            {/* Phone */}
                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    placeholder="Phone"
                                />
                                {renderError("phone")}
                            </div>

                            {/* Type */}
                            <div>
                                <Label>Type</Label>
                                <Input
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    placeholder="Type"
                                />
                                {renderError("type")}
                            </div>

                            {/* File Upload */}
                            <div className="col-span-2">
                                <Label>Profile Image</Label>
                                <Input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "profile_image",
                                            e.target.files?.[0] || null
                                        )
                                    }
                                />
                                {renderError("profile_image")}
                            </div>

                            {/* Submit */}
                            <div className="col-span-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    Create Supporter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
