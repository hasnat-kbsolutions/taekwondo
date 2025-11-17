import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Edit() {
    const { plan, currencies = [], errors = {} } = usePage().props as any;

    const [form, setForm] = useState({
        name: plan?.name || "",
        base_amount: plan?.base_amount?.toString?.() || "",
        currency_code: plan?.currency_code || "MYR",
        is_active: !!plan?.is_active,
        description: plan?.description || "",
    });

    const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route("club.plans.update", plan.id), {
            ...form,
            _method: "put",
        });
    };

    const err = (f: string) =>
        (errors as any)[f] && (
            <p className="text-red-500 text-sm mt-1">{(errors as any)[f]}</p>
        );

    return (
        <AuthenticatedLayout header="Edit Plan">
            <Head title="Edit Plan" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) =>
                                        set("name", e.target.value)
                                    }
                                />
                                {err("name")}
                            </div>
                            <div>
                                <Label>Base Amount</Label>
                                <Input
                                    type="number"
                                    value={form.base_amount}
                                    onChange={(e) =>
                                        set("base_amount", e.target.value)
                                    }
                                />
                                {err("base_amount")}
                            </div>
                            <div>
                                <Label>Currency</Label>
                                <Select
                                    value={form.currency_code}
                                    onValueChange={(v) =>
                                        set("currency_code", v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((c: any) => (
                                            <SelectItem
                                                key={c.code}
                                                value={c.code}
                                            >
                                                {c.code} - {c.symbol} {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {err("currency_code")}
                            </div>
                            <div className="col-span-2">
                                <Label>Description</Label>
                                <Input
                                    value={form.description}
                                    onChange={(e) =>
                                        set("description", e.target.value)
                                    }
                                />
                                {err("description")}
                            </div>
                            <div className="col-span-2 flex gap-3">
                                <Button type="submit">Save</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
