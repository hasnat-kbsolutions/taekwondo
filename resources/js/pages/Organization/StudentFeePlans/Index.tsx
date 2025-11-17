import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
    const { feePlans = [] } = usePage().props as any;

    return (
        <AuthenticatedLayout header="Student Fee Plans">
            <Head title="Student Fee Plans" />
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Student Fee Plans</h2>
                    <Link href={route("organization.student-fee-plans.create")}>
                        <Button>Assign Fee Plan</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="py-2 pr-4">Student</th>
                                        <th className="py-2 pr-4">Plan</th>
                                        <th className="py-2 pr-4">
                                            Custom Amount
                                        </th>
                                        <th className="py-2 pr-4">Currency</th>
                                        <th className="py-2 pr-4">Interval</th>
                                        <th className="py-2 pr-4">Discount</th>
                                        <th className="py-2 pr-4">Active</th>
                                        <th className="py-2 pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feePlans.map((fp: any) => (
                                        <tr
                                            key={fp.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2 pr-4">
                                                {fp.student?.name}{" "}
                                                {fp.student?.surname || ""}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {fp.plan?.name || "-"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {fp.custom_amount ?? "-"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {fp.currency_code ||
                                                    fp.plan?.currency_code ||
                                                    "-"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {fp.interval}
                                                {fp.interval === "custom" &&
                                                fp.interval_count
                                                    ? ` (${fp.interval_count})`
                                                    : ""}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {fp.discount_type
                                                    ? `${fp.discount_type} ${fp.discount_value}`
                                                    : "-"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {fp.is_active ? "Yes" : "No"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                <Link
                                                    href={route(
                                                        "organization.student-fee-plans.edit",
                                                        fp.id
                                                    )}
                                                    className="text-primary underline"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {feePlans.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="py-4 text-muted-foreground"
                                            >
                                                No student fee plans found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
