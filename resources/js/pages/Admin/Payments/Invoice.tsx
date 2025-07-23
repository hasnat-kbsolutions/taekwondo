import React from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Invoice() {
    const { payment } = usePage().props as any;
    if (!payment) return <div>No payment found.</div>;

    const student = payment.student || {};
    const club = student.club || {};
    const organization = student.organization || {};
    const items = payment.items || [];
    const total = payment.total || payment.amount || 0;

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="pb-2 border-b">
                    <div className="flex flex-row justify-between items-start w-full">
                        <div className="flex flex-col">
                            <CardTitle className="text-2xl font-bold text-foreground">
                                Invoice
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                Invoice #{payment.id}
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <div className="text-xs text-muted-foreground">
                                Date:{" "}
                                <span className="font-medium text-foreground">
                                    {payment.pay_at}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Month:{" "}
                                <span className="font-medium text-foreground">
                                    {payment.payment_month}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Status:{" "}
                                <Badge className="font-medium capitalize">
                                    {payment.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 pb-2">
                    <Label className="text-lg font-semibold mb-2 text-foreground">
                        Student Details
                    </Label>
                    <table className="w-full text-sm mb-6">
                        <tbody>
                            <tr className="align-top">
                                <td className="font-medium text-muted-foreground w-1/3 pr-4 py-1.5">
                                    Name
                                </td>
                                <td className="text-foreground text-right py-1.5">
                                    {student.name} {student.surname}
                                </td>
                            </tr>
                            <tr className="align-top">
                                <td className="font-medium text-muted-foreground w-1/3 pr-4 py-1.5">
                                    Student ID
                                </td>
                                <td className="text-foreground text-right py-1.5">
                                    {student.uid}
                                </td>
                            </tr>
                            <tr className="align-top">
                                <td className="font-medium text-muted-foreground w-1/3 pr-4 py-1.5">
                                    Club
                                </td>
                                <td className="text-foreground text-right py-1.5">
                                    {club.name || "-"}
                                </td>
                            </tr>
                            <tr className="align-top">
                                <td className="font-medium text-muted-foreground w-1/3 pr-4 py-1.5">
                                    Organization
                                </td>
                                <td className="text-foreground text-right py-1.5">
                                    {organization.name || "-"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Separator className="my-4" />
                    <Label className="text-lg font-semibold mb-2 text-foreground">
                        Items
                    </Label>
                    {items.length > 0 ? (
                        <div className="mt-2 mb-6">
                            {items.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex justify-between py-1 text-foreground"
                                >
                                    <span>{item.description}</span>
                                    <span>
                                        $
                                        {item.amount?.toFixed
                                            ? item.amount.toFixed(2)
                                            : item.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground mb-6">
                            No items listed.
                        </div>
                    )}
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center mb-4">
                        <Label className="text-lg text-foreground">Total</Label>
                        <span className="text-lg font-bold text-foreground">
                            ${total?.toFixed ? total.toFixed(2) : total}
                        </span>
                    </div>
                    {payment.notes && (
                        <div className="mt-4 text-sm text-muted-foreground">
                            {payment.notes}
                        </div>
                    )}
                    <div className="mt-8 flex gap-2 justify-end">
                        <Button
                            onClick={() => window.print()}
                            variant="default"
                        >
                            Print Invoice
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
