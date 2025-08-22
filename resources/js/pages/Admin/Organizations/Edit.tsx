import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Organization {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    city?: string;
    country?: string;
    street?: string;
    postal_code?: string;
    status: boolean;
    default_currency?: string;
}

interface Props {
    organization: Organization;
    currencies: Array<{
        code: string;
        name: string;
        symbol: string;
        is_default: boolean;
    }>;
}

export default function Edit({ organization, currencies }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: organization.name || "",
        email: organization.email || "",
        phone: organization.phone || "",
        website: organization.website || "",
        city: organization.city || "",
        country: organization.country || "",
        street: organization.street || "",
        postal_code: organization.postal_code || "",
        status: organization.status ?? true,
        default_currency: organization.default_currency || "MYR",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.organizations.update", organization.id));
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-sm text-red-500">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Edit Ahli Gabungan">
            <Head title="Edit Organization" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Organization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {renderError("name")}
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
                                {renderError("email")}
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
                                {renderError("password")}
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
                                <Label>Country</Label>
                                <Input
                                    value={data.country}
                                    onChange={(e) =>
                                        setData("country", e.target.value)
                                    }
                                />
                                {renderError("country")}
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
                                {renderError("status")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Default Currency
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.default_currency}
                                    onValueChange={(value) =>
                                        setData("default_currency", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency.code}
                                                value={currency.code}
                                            >
                                                {currency.code} -{" "}
                                                {currency.symbol}{" "}
                                                {currency.name}
                                                {currency.is_default &&
                                                    " (Default)"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {renderError("default_currency")}
                            </div>

                            <div className="w-full px-2 mt-6 flex justify-end">
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
