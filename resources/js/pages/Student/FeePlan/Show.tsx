import React from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Calendar, Percent, AlertCircle } from "lucide-react";

interface Plan {
    id: number;
    name: string;
    base_amount: number;
    currency_code: string;
    description?: string;
    planable?: {
        name: string;
    };
}

interface StudentFeePlan {
    id: number;
    student_id: number;
    plan_id?: number;
    plan?: Plan;
    custom_amount?: number;
    currency_code: string;
    interval: string;
    interval_count?: number;
    discount_type?: string;
    discount_value?: number;
    effective_from?: string;
    is_active: boolean;
    notes?: string;
    next_period_start?: string;
    next_due_date?: string;
}

interface Props {
    feePlan?: StudentFeePlan;
}

export default function Show({ feePlan }: Props) {
    if (!feePlan) {
        return (
            <AuthenticatedLayout>
                <Head title="Fee Plan" />
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                No fee plan has been assigned to your account yet.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const displayAmount = feePlan.custom_amount ?? feePlan.plan?.base_amount ?? 0;
    const currencySymbol = feePlan.currency_code === "MYR" ? "RM" : feePlan.currency_code;

    // Calculate effective amount after discount
    let effectiveAmount = displayAmount;
    if (feePlan.discount_type && feePlan.discount_value) {
        if (feePlan.discount_type === "percent") {
            effectiveAmount = displayAmount - (displayAmount * feePlan.discount_value) / 100;
        } else if (feePlan.discount_type === "fixed") {
            effectiveAmount = displayAmount - feePlan.discount_value;
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Fee Plan" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">My Fee Plan</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Plan Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Fee Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {feePlan.plan && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Plan Name
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {feePlan.plan.name}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Base Amount
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {currencySymbol} {displayAmount.toFixed(2)}
                                    </p>
                                </div>

                                {feePlan.discount_type && feePlan.discount_value ? (
                                    <div className="pt-4 border-t">
                                        <div className="mb-2">
                                            <p className="text-sm font-medium text-gray-600">
                                                Discount
                                            </p>
                                            <p className="text-sm text-gray-900">
                                                {feePlan.discount_type === "percent"
                                                    ? `${feePlan.discount_value}%`
                                                    : `${currencySymbol} ${feePlan.discount_value.toFixed(2)}`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Amount After Discount
                                            </p>
                                            <p className="text-xl font-bold text-green-600">
                                                {currencySymbol} {effectiveAmount.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>

                        {/* Billing Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Billing Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Billing Interval
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 capitalize">
                                        {feePlan.interval}
                                        {feePlan.interval_count &&
                                        feePlan.interval === "custom"
                                            ? ` (${feePlan.interval_count} cycles)`
                                            : ""}
                                    </p>
                                </div>

                                {feePlan.effective_from && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Effective From
                                        </p>
                                        <p className="text-lg text-gray-900">
                                            {new Date(
                                                feePlan.effective_from
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {feePlan.next_due_date && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Next Due Date
                                        </p>
                                        <p className="text-lg text-gray-900">
                                            {new Date(
                                                feePlan.next_due_date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <Badge
                                        variant={
                                            feePlan.is_active ? "default" : "secondary"
                                        }
                                        className="mt-1"
                                    >
                                        {feePlan.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Notes */}
                    {feePlan.notes && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{feePlan.notes}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Club Information */}
                    {feePlan.plan?.planable && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Club</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg text-gray-900">
                                    {feePlan.plan.planable.name}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
