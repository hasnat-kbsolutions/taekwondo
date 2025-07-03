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
import { CountryDropdown } from "@/components/ui/country-dropdown";

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    user?: {
        name: string;
        email: string;
    };
    password: string;
    password_confirmation: string;
    organization_id: number;
    city: string;
    country: string;
    street: string;
    postal_code: string;
    tax_number?: string;
    invoice_prefix?: string;
    phone?: string;
    skype?: string;
    notification_emails?: string;
    website?: string;
    status: boolean;
    logo?: string;
}

interface Props {
    club: Club;
    organizations: Organization[];
}

export default function Edit({ club, organizations }: Props) {
    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        organization_id: string;
        city: string;
        country: string;
        street: string;
        postal_code: string;
        tax_number: string;
        invoice_prefix: string;
        phone: string;
        skype: string;
        notification_emails: string;
        website: string;
        status: boolean;
        logo: File | null; // <-- Fix here
    }>({
        name: club.user?.name || "",
        email: club.user?.email || "",
        password: "",
        password_confirmation: "",
        organization_id: club.organization_id.toString(),
        city: club.city || "",
        country: club.country || "",
        street: club.street || "",
        postal_code: club.postal_code || "",
        tax_number: club.tax_number || "",
        invoice_prefix: club.invoice_prefix || "",
        phone: club.phone || "",
        skype: club.skype || "",
        notification_emails: club.notification_emails || "",
        website: club.website || "",
        status: club.status ?? false,
        logo: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.clubs.update", club.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Edit Club">
            <Head title="Edit Club" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Club</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Name</Label>
                                <Input
                                    placeholder="Club Name"
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

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="w-[25%] px-2 mt-3">
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
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Phone</Label>
                                <Input
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Skype</Label>
                                <Input
                                    value={data.skype}
                                    onChange={(e) =>
                                        setData("skype", e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Notification Emails</Label>
                                <Input
                                    value={data.notification_emails}
                                    onChange={(e) =>
                                        setData(
                                            "notification_emails",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Website</Label>
                                <Input
                                    value={data.website}
                                    onChange={(e) =>
                                        setData("website", e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Tax Number</Label>
                                <Input
                                    value={data.tax_number}
                                    onChange={(e) =>
                                        setData("tax_number", e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Invoice Prefix</Label>
                                <Input
                                    value={data.invoice_prefix}
                                    onChange={(e) =>
                                        setData(
                                            "invoice_prefix",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>City</Label>
                                <Input
                                    value={data.city}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Country
                                </Label>
                                <CountryDropdown
                                    placeholder="Select country"
                                    defaultValue={data.country} // your default or empty
                                    onChange={(c) =>
                                        setData("country", c.alpha3)
                                    }
                                    slim={false}
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm">
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Street</Label>
                                <Input
                                    value={data.street}
                                    onChange={(e) =>
                                        setData("street", e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Postal Code</Label>
                                <Input
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData("postal_code", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Logo</Label>
                                <Input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "logo",
                                            e.target.files?.[0] || null
                                        )
                                    }
                                />
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Status</Label>
                                <Select
                                    value={data.status ? "1" : "0"}
                                    onValueChange={(value) =>
                                        setData("status", value === "1")
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="0">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full px-2 mt-3">
                                <Button type="submit" disabled={processing}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
