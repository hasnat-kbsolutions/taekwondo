import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Calendar,
    User,
    CreditCard,
    Printer,
    Landmark,
    Download,
    ArrowLeft,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Invoice() {
    const { payment } = usePage().props as any;
    if (!payment) return <div>No payment found.</div>;

    const student = payment.student || {};
    const club = student.club || {};
    const organization = student.organization || {};
    const currency = payment.currency || { symbol: "$", code: "USD" };
    const items = payment.items || [];
    const total = payment.total || payment.amount || 0;

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Generate invoice number with prefix
    const invoiceNumber = `${club.invoice_prefix || "INV"}-${payment.id
        .toString()
        .padStart(6, "0")}`;

    return (
        <AuthenticatedLayout header="Invoice">
            <Head title={`Invoice #${invoiceNumber}`} />
            <div className="min-h-screen bg-background py-8 px-4 print:bg-white print:py-0 print:px-0">
                {/* Back Button and Actions - Hidden on print */}
                <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center print:hidden">
                    <Link href={route("student.payments.index")}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Payments
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => window.print()}
                            variant="default"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download/Print
                        </Button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto bg-card shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none border print:w-[210mm] print:h-[297mm] print:max-w-none print:mx-0">
                    {/* Header */}
                    <div className="bg-muted border-b p-8 print:p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                                {club.logo ? (
                                    <img
                                        src={club.logo}
                                        alt={`${club.name} Logo`}
                                        className="w-16 h-16 rounded-lg object-cover bg-background p-2 border"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-muted-foreground/10 flex items-center justify-center border">
                                        <Building2 className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">
                                        {club.name || "Taekwondo Club"}
                                    </h1>
                                    {organization.name && (
                                        <p className="text-muted-foreground text-lg">
                                            {organization.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl font-bold mb-2 text-foreground">
                                    INVOICE
                                </h2>
                                <p className="text-muted-foreground">
                                    #{invoiceNumber}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="p-8 print:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:gap-6 print:mb-6">
                            {/* From */}
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                    <Building2 className="w-5 h-5 mr-2" />
                                    From
                                </h3>
                                <div className="space-y-2 text-muted-foreground">
                                    <p className="font-semibold text-foreground">
                                        {club.name || "Taekwondo Club"}
                                    </p>
                                    {club.street && (
                                        <p className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {club.street}
                                        </p>
                                    )}
                                    {club.city && club.country && (
                                        <p>
                                            {club.city}, {club.country}
                                        </p>
                                    )}
                                    {club.phone && (
                                        <p className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {club.phone}
                                        </p>
                                    )}
                                    {club.email && (
                                        <p className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {club.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* To */}
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Bill To
                                </h3>
                                <div className="space-y-2 text-muted-foreground">
                                    <p className="font-semibold text-foreground">
                                        {student.name} {student.surname}
                                    </p>
                                    <p>Student ID: {student.uid}</p>
                                    {student.email && (
                                        <p className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {student.email}
                                        </p>
                                    )}
                                    {student.phone && (
                                        <p className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {student.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-muted/50 rounded-lg print:gap-4 print:mb-6 print:p-4">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">
                                    Invoice Date
                                </p>
                                <p className="font-semibold text-foreground flex items-center justify-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {formatDate(payment.pay_at)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">
                                    Payment Month
                                </p>
                                <p className="font-semibold text-foreground">
                                    {payment.payment_month}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">
                                    Status
                                </p>
                                <Badge
                                    variant={
                                        payment.status === "paid"
                                            ? "default"
                                            : "destructive"
                                    }
                                    className="capitalize font-medium px-3 py-1"
                                >
                                    {payment.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8 print:mb-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Payment Details
                            </h3>
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead className="text-right">
                                                Amount
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.length > 0 ? (
                                            items.map(
                                                (item: any, idx: number) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">
                                                            {item.description ||
                                                                "Payment"}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {payment.method ||
                                                                "N/A"}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {currency.symbol}
                                                            {item.amount
                                                                ?.toFixed
                                                                ? item.amount.toFixed(
                                                                      2
                                                                  )
                                                                : item.amount}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        ) : (
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Monthly Payment
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {payment.method || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {currency.symbol}
                                                    {total?.toFixed
                                                        ? total.toFixed(2)
                                                        : total}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-end mb-8 print:mb-6">
                            <div className="w-64">
                                <div className="bg-muted/50 p-6 rounded-lg">
                                    <div className="flex justify-between items-center text-lg font-semibold text-foreground">
                                        <span>Total Amount:</span>
                                        <span>
                                            {currency.symbol}
                                            {total?.toFixed
                                                ? total.toFixed(2)
                                                : total}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        Currency: {currency.code}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Information */}
                        {payment.bank_information &&
                            payment.bank_information.length > 0 && (
                                <div className="mb-8 print:mb-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                        <Landmark className="w-5 h-5 mr-2" />
                                        Bank Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {payment.bank_information.map(
                                            (bank: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="p-4 border rounded-lg bg-muted/30"
                                                >
                                                    <h4 className="font-semibold text-foreground mb-2">
                                                        {bank.bank_name}
                                                    </h4>
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <p>
                                                            <span className="font-medium">
                                                                Account Name:
                                                            </span>{" "}
                                                            {bank.account_name}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">
                                                                Account Number:
                                                            </span>{" "}
                                                            {
                                                                bank.account_number
                                                            }
                                                        </p>
                                                        {bank.iban && (
                                                            <p>
                                                                <span className="font-medium">
                                                                    IBAN:
                                                                </span>{" "}
                                                                {bank.iban}
                                                            </p>
                                                        )}
                                                        {bank.swift_code && (
                                                            <p>
                                                                <span className="font-medium">
                                                                    SWIFT Code:
                                                                </span>{" "}
                                                                {
                                                                    bank.swift_code
                                                                }
                                                            </p>
                                                        )}
                                                        {bank.branch && (
                                                            <p>
                                                                <span className="font-medium">
                                                                    Branch:
                                                                </span>{" "}
                                                                {bank.branch}
                                                            </p>
                                                        )}
                                                        {bank.currency && (
                                                            <p>
                                                                <span className="font-medium">
                                                                    Currency:
                                                                </span>{" "}
                                                                {bank.currency}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Notes */}
                        {payment.notes && (
                            <div className="mb-8 p-4 bg-muted border-l-4 border-border rounded print:mb-6 print:p-3">
                                <h4 className="text-sm font-medium text-foreground mb-2">
                                    Notes:
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {payment.notes}
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="border-t border-border pt-8 print:pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-foreground mb-2">
                                        Payment Terms
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Payment is due upon receipt of this
                                        invoice. Please contact us if you have
                                        any questions.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-sm font-medium text-foreground mb-2">
                                        Thank You!
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        We appreciate your business and
                                        continued support.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Print Button - Bottom */}
                    <div className="bg-muted/50 px-8 py-4 print:hidden">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                Generated on{" "}
                                {new Date().toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <Button
                                onClick={() => window.print()}
                                variant="outline"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print Invoice
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
