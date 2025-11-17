import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
    const { plans = [] } = usePage().props as any;

    return (
        <AuthenticatedLayout header="Plans">
            <Head title="Plans" />
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Plans</h2>
                    <Link href={route("club.plans.create")}>
                        <Button>Create Plan</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="py-2 pr-4">Name</th>
                                        <th className="py-2 pr-4">Amount</th>
                                        <th className="py-2 pr-4">Currency</th>
                                        <th className="py-2 pr-4">Active</th>
                                        <th className="py-2 pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.map((p: any) => (
                                        <tr
                                            key={p.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2 pr-4">
                                                {p.name}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {p.base_amount}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {p.currency_code}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {p.is_active ? "Yes" : "No"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                <Link
                                                    href={route(
                                                        "club.plans.edit",
                                                        p.id
                                                    )}
                                                    className="text-primary underline"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {plans.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-4 text-muted-foreground"
                                            >
                                                No plans found.
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
