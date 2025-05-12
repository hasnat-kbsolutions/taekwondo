import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";


interface Props {
    club: any;
    companies: { id: number; name: string }[];
    organizations: { id: number; name: string }[];
}

export default function Edit({ club, companies, organizations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        name: club.name || "",
        company_id: club.company_id || "",
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
        post(route("clubs.update", club.id), {
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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Company Dropdown */}
                            <div>
                                <label className="block text-sm mb-1">
                                    Company
                                </label>
                                <select
                                    value={data.company_id}
                                    onChange={(e) =>
                                        setData(
                                            "company_id",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
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
                                <label className="block text-sm mb-1">
                                    Organization
                                </label>
                                <select
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
                                </select>
                                {errors.organization_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.organization_id}
                                    </p>
                                )}
                            </div>

                            {/* Other Fields (similar to the original code) */}

                            {/* Name */}
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

                            {/* Invoice Prefix */}
                            <Input
                                placeholder="Invoice Prefix"
                                value={data.invoice_prefix}
                                onChange={(e) =>
                                    setData("invoice_prefix", e.target.value)
                                }
                            />
                            {errors.invoice_prefix && (
                                <p className="text-red-500 text-sm">
                                    {errors.invoice_prefix}
                                </p>
                            )}

                            {/* Logo */}
                            <Input
                                type="file"
                                onChange={(e) =>
                                    setData("logo", e.target.files?.[0] ?? null)
                                }
                            />
                            {errors.logo && (
                                <p className="text-red-500 text-sm">
                                    {errors.logo}
                                </p>
                            )}

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

                            {/* Phone */}
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

                            {/* Skype */}
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

                            {/* Postal Code */}
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

                            {/* City */}
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

                            {/* Street */}
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

                            {/* Country */}
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

                            {/* Submit */}
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
