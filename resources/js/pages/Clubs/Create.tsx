import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Select,  SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

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
                        <form onSubmit={handleSubmit} className="flex flex-wrap">
                            {/* Company Dropdown */}
                            <div className="w-[50%] px-2">
                                    <Label className="block text-sm mb-1">
                                        Company
                                    </Label>
                                     <Select>
                                        <SelectTrigger value={data.company_id}  onChange={(e) =>
                                            setData("company_id", e.target.value)} className="w-full border rounded px-3 py-2">
                                            <SelectValue placeholder="Select Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                        
                                            {companies.map((company) => (
                                            <SelectItem key={company.id}
                                        value={company.id.toString()}>{company.name}</SelectItem>
                                               ))}
                                            {/* <SelectItem value="banana">Banana</SelectItem>
                                            */}
                                            </SelectGroup>
                                        </SelectContent>
                                        </Select>
                                        
                                    {/* <select
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
                            </select> */}

                            {errors.company_id && (
                                <p className="text-red-500 text-sm">
                                    {errors.company_id}
                                </p>
                            )}
                            </div>
                            
                            <div className="w-[50%] px-2">
                            {/* Organization Dropdown */}
                                    <Label className="block text-sm mb-1">
                                        Organization
                                    </Label>
                                    <Select>
                                        <SelectTrigger value={data.organization_id}
                                        onChange={(e) => setData("organization_id", e.target.value)
                                        } className="w-full border rounded px-3 py-2">
                                            <SelectValue placeholder="Select Organization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            {organizations.map((org) => (
                                            <SelectItem key={org.id} value={org.id.toString()}> {org.name} </SelectItem>
                                               ))}
                                            {/* <SelectItem value="banana">Banana</SelectItem>
                                            */}
                                            </SelectGroup>
                                        </SelectContent>
                                        </Select>

                                    {/* <select
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
                                    </select> */}
                                    {errors.organization_id && (
                                        <p className="text-red-500 text-sm">
                                            {errors.organization_id}
                                        </p>
                                    )}
                                </div>

                            <div className="w-[50%] px-2 mt-3">
                            {/* Name */}
                             <Label className="block text-sm mb-1">
                                        Name
                                    </Label>
                            <Input type="text"
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
                                {/* Tax Number (optional) */}
                                 <Label className="block text-sm mb-1">
                                        Tax Number
                                    </Label>
                                <Input type="number"
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
                                            Invoice Prefix
                                    </Label>
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
                                </div>
                            
                            <div className="w-[50%] px-2 mt-3">
                                {/* Logo */}
                                 <Label className="block text-sm mb-1">
                                       Files
                                    </Label>
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
                            </div>

                            <div className="w-full px-2 mt-3">
                                {/* Status */}
                                <Label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.checked)
                                        }
                                    />
                                    <span>Status</span>
                                </Label>
                            {errors.status && (
                                <p className="text-red-500 text-sm">
                                    {errors.status}
                                </p>
                            )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                            {/* Email (optional) */}
                             <Label className="block text-sm mb-1">
                                       Email
                                    </Label>
                            <Input type="email"
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
                            {/* Phone (optional) */}
                             <Label className="block text-sm mb-1">
                                       Phone
                                    </Label>
                            <Input type="number"
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
                                <Label className="block text-sm mb-1">
                                       Skype
                                    </Label>
                            {/* Skype (optional) */}
                            <Input type="text"
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
                                       Notification Email
                                    </Label>
                            {/* Notification Emails (optional) */}
                            <Input type="email"
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
                                       Website
                                    </Label>
                            {/* Website (optional) */}
                            <Input type="text"
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
                                 <Label className="block text-sm mb-1">
                                       Postal Code
                                    </Label>
                            {/* Postal Code (optional) */}
                            <Input type="number"
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
                                 <Label className="block text-sm mb-1">
                                       City
                                    </Label>
                            {/* City (optional) */}
                            <Input type="text"
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
                                 <Label className="block text-sm mb-1">
                                        Street
                                    </Label>
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
                            </div>


                            <div className="w-[50%] px-2 mt-3">
                                 <Label className="block text-sm mb-1">
                                       City
                                    </Label>
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
                            </div>
                            
                            <div className="w-full px-2 mt-3">
                                {/* Submit */}
                                <Button type="submit" disabled={processing}>
                                    Create
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

