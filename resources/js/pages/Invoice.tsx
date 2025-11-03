import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
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
    const { payment, download, autoDownload } = usePage().props as any;
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

    // Utility function to safely format amounts
    const formatAmount = (amount: any, currencyCode: string) => {
        const numAmount = Number(amount) || 0;
        if (currencyCode === "JPY") {
            return numAmount.toLocaleString();
        } else {
            return numAmount.toFixed(2);
        }
    };

    // Generate invoice number with prefix
    const invoiceNumber = `${club.invoice_prefix || "INV"}-${payment.id
        .toString()
        .padStart(6, "0")}`;

    // This component can still be used for viewing invoices

    return (
        <>
            <style>{`
                       @media print {
                           @page {
                               size: A4;
                               margin: 15mm;
                           }
                           body {
                               margin: 0;
                               padding: 0;
                               background: white !important;
                               color: black !important;
                           }
                           * {
                               background: white !important;
                               color: black !important;
                               border-color: #d1d5db !important;
                           }
                           .invoice-container {
                               width: 100% !important;
                               max-width: 100% !important;
                               margin: 0 !important;
                               padding: 0 !important;
                               box-shadow: none !important;
                               border: 1px solid #d1d5db !important;
                               border-radius: 0 !important;
                               background: white !important;
                           }
                           .print-hidden {
                               display: none !important;
                           }
                           /* Hide theme header and navigation on print */
                           header, nav, .header, .navigation, [role="banner"] {
                               display: none !important;
                           }
                       }
            `}</style>
            <AuthenticatedLayout>
                <Head title={`Invoice #${invoiceNumber}`} />
                <div className="min-h-screen bg-background py-8 px-4 print:bg-white print:py-0 print:px-0 print:m-0">
                    {/* Back Button and Actions - Hidden on print */}
                    <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center print:hidden">
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const url = route("invoice.download", {
                                            payment: payment.id,
                                        });
                                        const response = await fetch(url);
                                        const blob = await response.blob();
                                        const downloadUrl =
                                            window.URL.createObjectURL(blob);
                                        const link =
                                            document.createElement("a");
                                        link.href = downloadUrl;
                                        link.download = `${invoiceNumber}.pdf`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(downloadUrl);
                                    } catch (error) {
                                        console.error(
                                            "Download failed:",
                                            error
                                        );
                                    }
                                }}
                                variant="default"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Invoice
                            </Button>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto bg-card shadow-lg rounded-lg overflow-hidden border invoice-container">
                        {/* Header */}
                        <div className="bg-muted border-b p-6 print:bg-white print:p-4 print:border-b print:border-gray-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    {club.logo ? (
                                        <img
                                            src={club.logo}
                                            alt={`${club.name} Logo`}
                                            className="w-20 h-20 object-contain"
                                        />
                                    ) : (
                                        <div>
                                            <h1 className="text-lg font-bold text-foreground print:text-black">
                                                {club.name || "Taekwondo Club"}
                                            </h1>
                                            {organization.name && (
                                                <p className="text-muted-foreground text-xs print:text-gray-700 ml-0">
                                                    {organization.name}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <h2 className="text-lg font-bold mb-1 text-foreground print:text-black">
                                        INVOICE
                                    </h2>
                                    <p className="text-muted-foreground text-sm print:text-gray-700">
                                        #{invoiceNumber}
                                    </p>
                                </div>
                            </div>
                            {/* Invoice Meta Info */}
                            <div className="flex justify-between mt-3 pt-3 border-t text-sm">
                                <div className="flex-1 text-left">
                                    <p className="text-muted-foreground text-xs print:text-gray-500">
                                        Invoice Date
                                    </p>
                                    <p className="font-semibold text-foreground print:text-black">
                                        {formatDate(payment.pay_at)}
                                    </p>
                                </div>
                                <div className="flex-1 text-center">
                                    <p className="text-muted-foreground text-xs print:text-gray-500">
                                        Payment Month
                                    </p>
                                    <p className="font-semibold text-foreground print:text-black">
                                        {payment.payment_month}
                                    </p>
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-muted-foreground text-xs print:text-gray-500">
                                        Status
                                    </p>
                                    <Badge
                                        variant={
                                            payment.status === "paid"
                                                ? "default"
                                                : "destructive"
                                        }
                                        className="capitalize text-xs px-2 py-0.5"
                                    >
                                        {payment.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="p-6 print:p-4">
                            <div className="flex justify-between gap-6 mb-4 print:gap-4 print:mb-3">
                                {/* From */}
                                <div className="flex-1 text-left pr-6">
                                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center print:text-black">
                                        <Building2 className="w-4 h-4 mr-1" />
                                        From
                                    </h3>
                                    <div className="space-y-1 text-sm text-muted-foreground print:text-gray-700">
                                        {!club.logo && (
                                            <p className="font-semibold text-foreground print:text-black">
                                                {club.name || "Taekwondo Club"}
                                            </p>
                                        )}
                                        {club.street && (
                                            <p className="text-xs">
                                                {club.street}
                                            </p>
                                        )}
                                        {club.city && club.country && (
                                            <p className="text-xs">
                                                {club.city}, {club.country}
                                            </p>
                                        )}
                                        {club.phone && (
                                            <p className="text-xs">
                                                {club.phone}
                                            </p>
                                        )}
                                        {club.email && (
                                            <p className="text-xs">
                                                {club.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* To */}
                                <div className="flex-1 text-right">
                                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center justify-end print:text-black">
                                        <User className="w-4 h-4 mr-1" />
                                        Bill To
                                    </h3>
                                    <div className="space-y-1 text-sm text-muted-foreground print:text-gray-700">
                                        <p className="font-semibold text-foreground print:text-black">
                                            {student.name} {student.surname}
                                        </p>
                                        <p className="text-xs">
                                            Student ID: {student.uid}
                                        </p>
                                        {student.email && (
                                            <p className="text-xs">
                                                {student.email}
                                            </p>
                                        )}
                                        {student.phone && (
                                            <p className="text-xs">
                                                {student.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details Table */}
                            <div className="mb-4 print:mb-3">
                                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center print:text-black">
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    Payment Details
                                </h3>
                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Description
                                                </TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead className="text-right">
                                                    Amount
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.length > 0 ? (
                                                items.map(
                                                    (
                                                        item: any,
                                                        idx: number
                                                    ) => (
                                                        <TableRow key={idx}>
                                                            <TableCell className="font-medium text-sm">
                                                                {item.description ||
                                                                    "Payment"}
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground text-sm">
                                                                {payment.method ||
                                                                    "N/A"}
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium text-sm">
                                                                {currency.code ===
                                                                "MYR"
                                                                    ? "RM "
                                                                    : currency.symbol}
                                                                {formatAmount(
                                                                    item.amount,
                                                                    currency.code
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            ) : (
                                                <TableRow>
                                                    <TableCell className="font-medium text-sm">
                                                        Monthly Payment
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {payment.method ||
                                                            "N/A"}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-sm">
                                                        {currency.code === "MYR"
                                                            ? "RM "
                                                            : currency.symbol}
                                                        {formatAmount(
                                                            total,
                                                            currency.code
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {/* Total Row */}
                                            <TableRow className="bg-muted print:bg-gray-50 border-t-2">
                                                <TableCell
                                                    colSpan={2}
                                                    className="font-bold text-foreground print:text-black"
                                                >
                                                    Total Amount (
                                                    {currency.code})
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-lg text-foreground print:text-black">
                                                    {currency.code === "MYR"
                                                        ? "RM "
                                                        : currency.symbol}
                                                    {formatAmount(
                                                        total,
                                                        currency.code
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Bank Information */}
                            {payment.bank_information &&
                                payment.bank_information.length > 0 && (
                                    <div className="mb-4 print:mb-3">
                                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center print:text-black">
                                            <Landmark className="w-4 h-4 mr-1" />
                                            Bank Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2">
                                            {payment.bank_information.map(
                                                (bank: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="p-3 border rounded-lg bg-muted print:bg-gray-50"
                                                    >
                                                        <h4 className="font-semibold text-foreground mb-1 text-sm print:text-black">
                                                            {bank.bank_name}
                                                        </h4>
                                                        <div className="space-y-0.5 text-xs text-muted-foreground print:text-gray-700">
                                                            <p>
                                                                <span className="font-medium">
                                                                    Account
                                                                    Name:
                                                                </span>{" "}
                                                                {
                                                                    bank.account_name
                                                                }
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">
                                                                    Account
                                                                    Number:
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
                                                                        SWIFT
                                                                        Code:
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
                                                                    {
                                                                        bank.branch
                                                                    }
                                                                </p>
                                                            )}
                                                            {bank.currency && (
                                                                <p>
                                                                    <span className="font-medium">
                                                                        Currency:
                                                                    </span>{" "}
                                                                    {
                                                                        bank.currency
                                                                    }
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
                                <div className="mb-3 p-3 bg-muted border-l-4 border-primary rounded print:bg-gray-50 print:border-gray-400 print:mb-2 print:p-2">
                                    <h4 className="text-xs font-medium text-foreground mb-1 print:text-black">
                                        Notes:
                                    </h4>
                                    <p className="text-xs text-muted-foreground print:text-gray-700">
                                        {payment.notes}
                                    </p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="border-t pt-4 print:border-gray-300 print:pt-3 print-hidden">
                                <div className="text-right">
                                    <h4 className="text-xs font-medium text-foreground mb-1 print:text-black">
                                        Thank You!
                                    </h4>
                                    <p className="text-xs text-muted-foreground print:text-gray-700">
                                        We appreciate your business and
                                        continued support.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Bottom */}
                        <div className="bg-muted px-6 py-3 print:hidden border-t">
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-muted-foreground">
                                    Generated on{" "}
                                    {new Date().toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
