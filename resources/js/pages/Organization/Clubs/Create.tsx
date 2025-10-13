"use client";

import React, { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

interface Organization {
    id: number;
    name: string;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",

        tax_number: "",
        invoice_prefix: "",
        phone: "",
        notification_emails: false,
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
        post(route("organization.clubs.store"), {
            forceFormData: true,
        });
    };

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
                        <CardTitle>Create Club</CardTitle>
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
                                <Label>Phone</Label>
                                <Input
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                />
                                {renderError("phone")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Website</Label>
                                <Input
                                    value={data.website}
                                    onChange={(e) =>
                                        setData("website", e.target.value)
                                    }
                                />
                                {renderError("website")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Tax Number</Label>
                                <Input
                                    value={data.tax_number}
                                    onChange={(e) =>
                                        setData("tax_number", e.target.value)
                                    }
                                />
                                {renderError("tax_number")}
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
                                {renderError("invoice_prefix")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>City</Label>
                                <Input
                                    value={data.city}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                />
                                {renderError("city")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Street</Label>
                                <Input
                                    value={data.street}
                                    onChange={(e) =>
                                        setData("street", e.target.value)
                                    }
                                />
                                {renderError("street")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Postal Code</Label>
                                <Input
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData("postal_code", e.target.value)
                                    }
                                />
                                {renderError("postal_code")}
                            </div>

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

                            <div className="w-[25%] px-2 mt-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="notification_emails"
                                        checked={data.notification_emails}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "notification_emails",
                                                checked as boolean
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="notification_emails"
                                        className="cursor-pointer"
                                    >
                                        Enable Notification Emails
                                    </Label>
                                </div>
                                {renderError("notification_emails")}
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
