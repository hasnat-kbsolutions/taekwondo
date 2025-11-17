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

export default function Edit() {
    const {
        studentFeePlan,
        students = [],
        plans = [],
        currencies = [],
        errors = {},
    } = usePage().props as any;
    const [form, setForm] = useState({
        student_id: studentFeePlan?.student_id
            ? String(studentFeePlan.student_id)
            : "",
        plan_id: studentFeePlan?.plan_id ? String(studentFeePlan.plan_id) : "",
        custom_amount: studentFeePlan?.custom_amount?.toString?.() || "",
        currency_code: studentFeePlan?.currency_code || "",
        interval: studentFeePlan?.interval || "monthly",
        interval_count: studentFeePlan?.interval_count?.toString?.() || "",
        discount_type: studentFeePlan?.discount_type || "",
        discount_value: studentFeePlan?.discount_value?.toString?.() || "",
        effective_from: studentFeePlan?.effective_from || "",
        is_active: !!studentFeePlan?.is_active,
        notes: studentFeePlan?.notes || "",
    });

    // Get selected student
    const selectedStudent = form.student_id
        ? students.find((s: any) => s.id === Number(form.student_id))
        : null;

    // Filter plans by selected student's club
    const filteredPlans = selectedStudent?.club_id
        ? plans.filter(
              (p: any) =>
                  p.planable_type === "App\\Models\\Club" &&
                  p.planable_id === selectedStudent.club_id
          )
        : [];

    const set = (k: string, v: any) => {
        setForm((p) => {
            const newForm = { ...p, [k]: v };
            // Reset plan when student changes
            if (k === "student_id") {
                newForm.plan_id = "";
            }
            return newForm;
        });
    };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            route("organization.student-fee-plans.update", studentFeePlan.id),
            {
                student_id: form.student_id,
                plan_id: form.plan_id || null,
                custom_amount: form.custom_amount || null,
                currency_code: form.currency_code || null,
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
                is_active: form.is_active,
                notes: form.notes || null,
                _method: "put",
            }
        );
    };
    const err = (f: string) =>
        (errors as any)[f] && (
            <p className="text-red-500 text-sm mt-1">{(errors as any)[f]}</p>
        );

    return (
        <AuthenticatedLayout header="Edit Student Fee Plan">
            <Head title="Edit Student Fee Plan" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Student Fee Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <Label>Student</Label>
                                <Select
                                    value={form.student_id}
                                    onValueChange={(v) => set("student_id", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((s: any) => (
                                            <SelectItem
                                                key={s.id}
                                                value={String(s.id)}
                                            >
                                                {s.name} {s.surname || ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {err("student_id")}
                            </div>

                            <div>
                                <Label>Plan</Label>
                                <Select
                                    value={form.plan_id}
                                    onValueChange={(v) => set("plan_id", v)}
                                    disabled={!form.student_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Plan (or leave blank for custom)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredPlans.length > 0 ? (
                                            filteredPlans.map((p: any) => (
                                                <SelectItem
                                                    key={p.id}
                                                    value={String(p.id)}
                                                >
                                                    {p.name} - {p.currency_code}{" "}
                                                    {p.base_amount}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>
                                                {form.student_id
                                                    ? "No plans available for this student's club"
                                                    : "Select a student first"}
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {err("plan_id")}
                            </div>

                            <div>
                                <Label>Custom Amount (optional)</Label>
                                <Input
                                    value={form.custom_amount}
                                    onChange={(e) =>
                                        set("custom_amount", e.target.value)
                                    }
                                    type="number"
                                />
                                {err("custom_amount")}
                            </div>

                            <div>
                                <Label>Currency (optional)</Label>
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

                            <div className="col-span-2">
                                <Label>Notes</Label>
                                <Input
                                    value={form.notes}
                                    onChange={(e) =>
                                        set("notes", e.target.value)
                                    }
                                />
                                {err("notes")}
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
