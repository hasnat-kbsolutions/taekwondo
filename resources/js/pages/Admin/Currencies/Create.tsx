import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

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

            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Currency</CardTitle>
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
                                    Currency Code{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
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
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    ISO 4217 code (e.g., USD, EUR, MYR)
                                </p>
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Symbol{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    value={form.symbol}
                                    onChange={(e) =>
                                        handleChange("symbol", e.target.value)
                                    }
                                    placeholder="$"
                                    maxLength={10}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Currency symbol (e.g., $, €, RM)
                                </p>
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Currency Name{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)
                                    }
                                    placeholder="US Dollar"
                                    required
                                />
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Decimal Places{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
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
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Number of decimal places (0-4)
                                </p>
                            </div>

                            <div className="w-[25%] px-2 mt-3">
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
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>

                            <div className="w-[25%] px-2 mt-3">
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

                            <div className="w-full px-2 mt-4">
                                <Button type="submit">Submit</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
