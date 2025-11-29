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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button as ShadButton } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

export default function Create() {
    const {
        organizations = [],
        currencies = [],
        errors = {},
    } = usePage().props as any;

    const [form, setForm] = useState({
        organization_id: "",
        name: "",
        base_amount: "",
        currency_code: "MYR",
        is_active: true,
        description: "",
        interval: "monthly",
        interval_count: "",
        discount_type: "",
        discount_value: "",
        effective_from: "",
    });

    const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route("admin.plans.store"), {
            organization_id: form.organization_id,
            name: form.name,
            base_amount: form.base_amount,
            currency_code: form.currency_code,
            is_active: form.is_active,
            description: form.description,
            interval: form.interval,
            interval_count:
                form.interval === "custom"
                    ? Number(form.interval_count || 0)
                    : null,
            discount_type: form.discount_type || null,
            discount_value: form.discount_value
                ? Number(form.discount_value)
                : 0,
            effective_from: form.effective_from || null,
        });
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

                            <div>
                                <Label>Interval</Label>
                                <Select
                                    value={form.interval}
                                    onValueChange={(v) => set("interval", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Interval" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">
                                            Monthly
                                        </SelectItem>
                                        <SelectItem value="quarterly">
                                            Quarterly
                                        </SelectItem>
                                        <SelectItem value="semester">
                                            Semester
                                        </SelectItem>
                                        <SelectItem value="yearly">
                                            Yearly
                                        </SelectItem>
                                        <SelectItem value="custom">
                                            Custom (months)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {err("interval")}
                            </div>

                            {form.interval === "custom" && (
                                <div>
                                    <Label>Interval Count (months)</Label>
                                    <Input
                                        value={form.interval_count}
                                        onChange={(e) =>
                                            set(
                                                "interval_count",
                                                e.target.value
                                            )
                                        }
                                        type="number"
                                        min={1}
                                    />
                                    {err("interval_count")}
                                </div>
                            )}

                            <div>
                                <Label>Discount Type</Label>
                                <Select
                                    value={form.discount_type || ""}
                                    onValueChange={(v) =>
                                        set(
                                            "discount_type",
                                            v === "none" ? "" : v
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        <SelectItem value="percent">
                                            Percent
                                        </SelectItem>
                                        <SelectItem value="fixed">
                                            Fixed
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {err("discount_type")}
                            </div>

                            <div>
                                <Label>Discount Value</Label>
                                <Input
                                    value={form.discount_value}
                                    onChange={(e) =>
                                        set("discount_value", e.target.value)
                                    }
                                    type="number"
                                    min={0}
                                />
                                {err("discount_value")}
                            </div>

                            <div>
                                <Label>Effective From</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <ShadButton
                                            variant={"outline"}
                                            className={
                                                "w-full justify-start text-left font-normal " +
                                                (!form.effective_from &&
                                                    "text-muted-foreground")
                                            }
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {form.effective_from
                                                ? format(
                                                      new Date(
                                                          form.effective_from
                                                      ),
                                                      "PPP"
                                                  )
                                                : "Pick a date"}
                                        </ShadButton>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                form.effective_from
                                                    ? new Date(
                                                          form.effective_from
                                                      )
                                                    : undefined
                                            }
                                            onSelect={(date) =>
                                                set(
                                                    "effective_from",
                                                    date
                                                        ? format(
                                                              date,
                                                              "yyyy-MM-dd"
                                                          )
                                                        : ""
                                                )
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {err("effective_from")}
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
