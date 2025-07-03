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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        tax_number: string;
        invoice_prefix: string;
        phone: string;
        skype: string;
        notification_emails: string;
        website: string;
        logo: File | null;
        status: boolean;
        city: string;
        country: string;
        street: string;
        postal_code: string;
    }>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        tax_number: "",
        invoice_prefix: "",
        phone: "",
        skype: "",
        notification_emails: "",
        website: "",
        logo: null,
        status: false,
        city: "",
        country: "",
        street: "",
        postal_code: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("organization.clubs.store"));
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
                            <div>
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

                            <div>
                                <Label>Email</Label>
                                <Input
                                    placeholder="Email for login"
                                    type="email"
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
     <div>
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

                            <div>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>City</Label>
                                    <Input
                                        value={data.city}
                                        onChange={(e) =>
                                            setData("city", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                       <Label className="block text-sm mb-1">Country</Label>
                                                                                              <CountryDropdown
                                                                                                  placeholder="Select country"
                                                                                                  defaultValue={data.country} // your default or empty
                                                                                                  onChange={(c) => setData("country", c.alpha3)}
                                                                                                  slim={false}
                                                                                              />
                                                                                              {errors.country && (
                                                                                                  <p className="text-red-500 text-sm">
                                                                                                      {errors.country}
                                                                                                  </p>
                                                                                              )}
                                </div>
                                <div>
                                    <Label>Street</Label>
                                    <Input
                                        value={data.street}
                                        onChange={(e) =>
                                            setData("street", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Postal Code</Label>
                                    <Input
                                        value={data.postal_code}
                                        onChange={(e) =>
                                            setData(
                                                "postal_code",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Phone</Label>
                                    <Input
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Skype</Label>
                                    <Input
                                        value={data.skype}
                                        onChange={(e) =>
                                            setData("skype", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Tax Number</Label>
                                    <Input
                                        value={data.tax_number}
                                        onChange={(e) =>
                                            setData(
                                                "tax_number",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
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
                                <div>
                                    <Label>Website</Label>
                                    <Input
                                        value={data.website}
                                        onChange={(e) =>
                                            setData("website", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Notification Emails</Label>
                                    <Input
                                        placeholder="Comma-separated emails"
                                        value={data.notification_emails}
                                        onChange={(e) =>
                                            setData(
                                                "notification_emails",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Logo</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            "logo",
                                            e.target.files?.[0] || null
                                        )
                                    }
                                />
                                {errors.logo && (
                                    <p className="text-red-500 text-sm">
                                        {errors.logo}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label>Status</Label>
                                <Select
                                    value={data.status.toString()}
                                    onValueChange={(val) =>
                                        setData("status", val === "true")
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="false">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

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
