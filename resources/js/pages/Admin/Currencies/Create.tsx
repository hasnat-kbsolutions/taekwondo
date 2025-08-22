import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Link } from "@inertiajs/react";

export default function Create() {
    const [form, setForm] = useState({
        code: "",
        name: "",
        symbol: "",
        decimal_places: 2,
        is_active: true,
        is_default: false,
    });

    const handleChange = (field: string, value: string | number | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route("admin.currencies.store"), form);
    };

    return (
        <AuthenticatedLayout header="Create Currency">
            <Head title="Create Currency" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route("admin.currencies.index")}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-1" />
                            Back to Currencies
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Currency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="code">
                                            Currency Code *
                                        </Label>
                                        <Input
                                            id="code"
                                            type="text"
                                            value={form.code}
                                            onChange={(e) =>
                                                handleChange(
                                                    "code",
                                                    e.target.value.toUpperCase()
                                                )
                                            }
                                            placeholder="USD"
                                            maxLength={3}
                                            required
                                            className="mt-1"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            ISO 4217 code (e.g., USD, EUR, MYR)
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="symbol">Symbol *</Label>
                                        <Input
                                            id="symbol"
                                            type="text"
                                            value={form.symbol}
                                            onChange={(e) =>
                                                handleChange(
                                                    "symbol",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="$"
                                            maxLength={10}
                                            required
                                            className="mt-1"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Currency symbol (e.g., $, €, RM)
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="name">
                                        Currency Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            handleChange("name", e.target.value)
                                        }
                                        placeholder="US Dollar"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="decimal_places">
                                        Decimal Places *
                                    </Label>
                                    <Input
                                        id="decimal_places"
                                        type="number"
                                        value={form.decimal_places}
                                        onChange={(e) =>
                                            handleChange(
                                                "decimal_places",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        min={0}
                                        max={4}
                                        required
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Number of decimal places (0-4)
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={form.is_active}
                                            onCheckedChange={(checked) =>
                                                handleChange(
                                                    "is_active",
                                                    checked as boolean
                                                )
                                            }
                                        />
                                        <Label htmlFor="is_active">
                                            Active
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_default"
                                            checked={form.is_default}
                                            onCheckedChange={(checked) =>
                                                handleChange(
                                                    "is_default",
                                                    checked as boolean
                                                )
                                            }
                                        />
                                        <Label htmlFor="is_default">
                                            Set as Default Currency
                                        </Label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route("admin.currencies.index")}
                                    >
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit">
                                        Create Currency
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
