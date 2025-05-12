import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

   // Props for Create and Edit
    interface Props {
        companies: { id: number; name: string }[];
        organizations: { id: number; name: string }[];
        club?: any; // for Edit
}
    
export default function Create({ companies, organizations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: "",
        organization_id: "",
        name: "",
        tax_number: "",
        invoice_prefix: "",
        logo: null as File | null, 
        status: false,
        email: "",
        phone: "",
        skype: "",
        notification_emails: "",
        website: "",
        postal_code: "",
        city: "",
        street: "",
        country: "",
    });

 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("clubs.store"), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Create Club">
            <Head title="Create Club" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Club</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Company Dropdown */}
                            <label className="block text-sm mb-1">
                                Company
                            </label>
                            <select
                                value={data.company_id}
                                onChange={(e) =>
                                    setData("company_id", e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select Company</option>
                                {companies.map((company) => (
                                    <option
                                        key={company.id}
                                        value={company.id.toString()}
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

                            {/* Organization Dropdown */}
                            <label className="block text-sm mb-1">
                                Organization
                            </label>
                            <select
                                value={data.organization_id}
                                onChange={(e) =>
                                    setData("organization_id", e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select Organization</option>
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

                            {/* Tax Number (optional) */}
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

                            {/* Email (optional) */}
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

                            {/* Phone (optional) */}
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

                            {/* Skype (optional) */}
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

                            {/* Notification Emails (optional) */}
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

                            {/* Website (optional) */}
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

                            {/* Postal Code (optional) */}
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

                            {/* City (optional) */}
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

                            {/* Street (optional) */}
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

                            {/* Country (optional) */}
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
                                Create
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

