import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    club: any;
    branches: { id: number; name: string }[];
    organizations: { id: number; name: string }[];
}

export default function Edit({ club, branches, organizations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        name: club.name || "",
        branch_id: club.branch_id || "",
        organization_id: club.organization_id || "",
        tax_number: club.tax_number || "",
        invoice_prefix: club.invoice_prefix || "",
        logo: club.logo || "",
        status: club.status || false,
        email: club.email || "",
        phone: club.phone || "",
        skype: club.skype || "",
        notification_emails: club.notification_emails || "",
        website: club.website || "",
        postal_code: club.postal_code || "",
        city: club.city || "",
        street: club.street || "",
        country: club.country || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.clubs.update", club.id), {
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
                            {/* Branch Dropdown */}
                            <div className="w-[50%] px-2">
                                <Label className="block text-sm mb-1">
                                    Branch
                                </Label>
                                <Select
                                    value={data.branch_id?.toString()}
                                    onValueChange={(value) =>
                                        setData("branch_id", parseInt(value))
                                    }
                                >
                                    <SelectTrigger className="w-full border rounded px-3 py-2">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {" "}
                                        {branches.map((branch) => (
                                            <SelectItem
                                                key={branch.id}
                                                value={branch.id.toString()}
                                            >
                                                {" "}
                                                {branch.name}{" "}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* <select
                                    value={data.branch_id}
                                    onChange={(e) =>
                                        setData(
                                            "branch_id",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch) => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}
                                        >
                                            {branch.name}
                                        </option>
                                    ))}
                                </select> */}

                                {errors.branch_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.branch_id}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2">
                                <Label className="block text-sm mb-1">
                                    Organization
                                </Label>
                                <Select
                                    value={data.organization_id?.toString()}
                                    onValueChange={(value) =>
                                        setData(
                                            "organization_id",
                                            parseInt(value)
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full border rounded px-3 py-2">
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {organizations.map((org) => (
                                                <SelectItem
                                                    key={org.id}
                                                    value={org.id.toString()}
                                                >
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {/* <select
                                    value={data.organization_id}
                                    onChange={(e) =>
                                        setData(
                                            "organization_id",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">
                                        Select Organization
                                    </option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select> */}
                                {errors.organization_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.organization_id}
                                    </p>
                                )}
                            </div>

                            {/* Other Fields (similar to the original code) */}

                            {/* Name */}
                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Name{" "}
                                </Label>
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

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Tax Number{" "}
                                </Label>
                                {/* Tax Number */}
                                <Input
                                    placeholder="Tax Number"
                                    value={data.tax_number}
                                    onChange={(e) =>
                                        setData("tax_number", e.target.value)
                                    }
                                />
                                {errors.tax_number && (
                                    <p className="text-red-500 text-sm">
                                        {errors.tax_number}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                {/* Invoice Prefix */}
                                <Label className="block text-sm mb-1">
                                    Invoice{" "}
                                </Label>
                                <Input
                                    placeholder="Invoice Prefix"
                                    value={data.invoice_prefix}
                                    onChange={(e) =>
                                        setData(
                                            "invoice_prefix",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.invoice_prefix && (
                                    <p className="text-red-500 text-sm">
                                        {errors.invoice_prefix}
                                    </p>
                                )}
                            </div>

                            {/* Logo */}
                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Files{" "}
                                </Label>
                                <Input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "logo",
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                />
                                {errors.logo && (
                                    <p className="text-red-500 text-sm">
                                        {errors.logo}
                                    </p>
                                )}
                            </div>

                            <div className="w-full px-2 mt-3">
                                {/* Status */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.checked)
                                        }
                                    />
                                    <span>Status</span>
                                </label>
                                {errors.status && (
                                    <p className="text-red-500 text-sm">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Email{" "}
                                </Label>
                                {/* Email */}
                                <Input
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                {/* Phone */}
                                <Label className="block text-sm mb-1">
                                    Phone{" "}
                                </Label>
                                <Input
                                    placeholder="Phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                {/* Skype */}
                                <Label className="block text-sm mb-1">
                                    Skype{" "}
                                </Label>
                                <Input
                                    placeholder="Skype"
                                    value={data.skype}
                                    onChange={(e) =>
                                        setData("skype", e.target.value)
                                    }
                                />
                                {errors.skype && (
                                    <p className="text-red-500 text-sm">
                                        {errors.skype}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Notification{" "}
                                </Label>
                                {/* Notification Emails */}
                                <Input
                                    placeholder="Notification Emails"
                                    value={data.notification_emails}
                                    onChange={(e) =>
                                        setData(
                                            "notification_emails",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.notification_emails && (
                                    <p className="text-red-500 text-sm">
                                        {errors.notification_emails}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Website{" "}
                                </Label>
                                {/* Website */}
                                <Input
                                    placeholder="Website"
                                    value={data.website}
                                    onChange={(e) =>
                                        setData("website", e.target.value)
                                    }
                                />
                                {errors.website && (
                                    <p className="text-red-500 text-sm">
                                        {errors.website}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                {/* Postal Code */}
                                <Label className="block text-sm mb-1">
                                    Postal Code{" "}
                                </Label>
                                <Input
                                    placeholder="Postal Code"
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData("postal_code", e.target.value)
                                    }
                                />
                                {errors.postal_code && (
                                    <p className="text-red-500 text-sm">
                                        {errors.postal_code}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                {/* City */}
                                <Label className="block text-sm mb-1">
                                    City{" "}
                                </Label>
                                <Input
                                    placeholder="City"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm">
                                        {errors.city}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                {/* Street */}
                                <Label className="block text-sm mb-1">
                                    Street{" "}
                                </Label>
                                <Input
                                    placeholder="Street"
                                    value={data.street}
                                    onChange={(e) =>
                                        setData("street", e.target.value)
                                    }
                                />
                                {errors.street && (
                                    <p className="text-red-500 text-sm">
                                        {errors.street}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                {/* Country */}
                                <Label className="block text-sm mb-1">
                                    Country{" "}
                                </Label>
                                <Input
                                    placeholder="Country"
                                    value={data.country}
                                    onChange={(e) =>
                                        setData("country", e.target.value)
                                    }
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm">
                                        {errors.country}
                                    </p>
                                )}
                            </div>

                            <div className="w-full px-2 mt-3">
                                {/* Submit */}
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
