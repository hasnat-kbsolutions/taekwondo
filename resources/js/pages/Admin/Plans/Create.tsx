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

export default function Create() {
    const {
        organizations = [],
        clubs = [],
        currencies = [],
        errors = {},
    } = usePage().props as any;

    const [form, setForm] = useState({
        organization_id: "",
        club_id: "",
        name: "",
        base_amount: "",
        currency_code: "MYR",
        is_active: true,
        description: "",
    });

    const filteredClubs = form.organization_id
        ? clubs.filter(
              (c: any) => c.organization_id === Number(form.organization_id)
          )
        : [];

    const set = (k: string, v: any) => {
        setForm((p) => {
            const newForm = { ...p, [k]: v };
            // Reset club when organization changes
            if (k === "organization_id") {
                newForm.club_id = "";
            }
            return newForm;
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route("admin.plans.store"), form);
    };

    const err = (f: string) =>
        (errors as any)[f] && (
            <p className="text-red-500 text-sm mt-1">{(errors as any)[f]}</p>
        );

    return (
        <AuthenticatedLayout header="Create Plan">
            <Head title="Create Plan" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <Label>
                                    Organization
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.organization_id}
                                    onValueChange={(v) =>
                                        set("organization_id", v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org: any) => (
                                            <SelectItem
                                                key={org.id}
                                                value={String(org.id)}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {err("organization_id")}
                            </div>

                            <div>
                                <Label>
                                    Club
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.club_id}
                                    onValueChange={(v) => set("club_id", v)}
                                    disabled={!form.organization_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Club" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredClubs.map((club: any) => (
                                            <SelectItem
                                                key={club.id}
                                                value={String(club.id)}
                                            >
                                                {club.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {err("club_id")}
                            </div>

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
