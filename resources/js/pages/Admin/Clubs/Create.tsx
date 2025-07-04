"use client";

import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";

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

interface Props {
    organizations: Organization[];
}

export default function Create({ organizations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",

        organization_id: "",
        tax_number: "",
        invoice_prefix: "",
        phone: "",
        skype: "",
        notification_emails: "",
        website: "",
        logo: null as File | null,
        status: false,
        city: "",
        country: "",
        street: "",
        postal_code: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.dismiss();
        post(route("admin.clubs.store"), {
            forceFormData: true,
         
        });
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([_, message]) => {
                toast.error("Validation Error", {
                    description: message,
                });
            });
        }
    }, [errors]);

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Create Club">
            <Head title="Create Club" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Club</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Fields marked with * are required.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {renderError("name")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {renderError("email")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Password{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {renderError("password")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Confirm Password{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
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
                                {renderError("password_confirmation")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
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
                                                value={org.id.toString()}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {renderError("organization_id")}
                            </div>

                            {[
                                "phone",
                                "skype",
                                "notification_emails",
                                "website",
                                "tax_number",
                                "invoice_prefix",
                                "city",
                                "street",
                                "postal_code",
                            ].map((field) => (
                                <div
                                    key={field}
                                    className="w-[25%] px-2 mt-3 capitalize"
                                >
                                    <Label>{field.replace("_", " ")}</Label>
                                    <Input
                                        value={String(
                                            data[field as keyof typeof data] ??
                                                ""
                                        )}
                                        onChange={(e) =>
                                            setData(
                                                field as keyof typeof data,
                                                e.target.value
                                            )
                                        }
                                    />
                                    {renderError(field as keyof typeof errors)}
                                </div>
                            ))}

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Country</Label>
                                <CountryDropdown
                                    placeholder="Select country"
                                    defaultValue={data.country || undefined}
                                    onChange={(c) =>
                                        setData("country", c?.alpha3 ?? "")
                                    }
                                    slim={false}
                                />
                                {renderError("country")}
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
                                {renderError("logo")}
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

                            <div className="w-full px-2 mt-4">
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
