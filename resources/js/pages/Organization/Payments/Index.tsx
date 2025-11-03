import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    FileText,
    Wallet,
    BadgeCheck,
    Hourglass,
    CheckCircle,
    XCircle,
    Download,
    Upload,
    FileCheck,
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { route } from "ziggy-js";

interface Student {
    id: number;
    name: string;
}

interface PaymentAttachment {
    id: number;
    payment_id: number;
    file_path: string;
    original_filename: string;
    file_type: string;
    file_size: number;
}

interface Payment {
    id: number;
    student: Student;
    amount: number;
    currency_code: string;
    currency?: {
        code: string;
        symbol: string;
        name: string;
    };
    status: string;
    method: string;
    payment_month: string;
    pay_at: string;
    notes?: string;
    attachment?: PaymentAttachment;
}

interface Props {
    payments: Payment[];
    filters: {
        status?: string;
        payment_month?: string;
        currency_code?: string;
    };
    amountsByCurrency?: Record<string, number>;
    defaultCurrencyCode?: string;
    currencies: Array<{
        code: string;
        name: string;
        symbol: string;
    }>;
}

// Utility function to safely format amounts
const formatAmount = (amount: any, currencyCode: string) => {
    const numAmount = Number(amount) || 0;

    if (currencyCode === "JPY") {
        return numAmount.toLocaleString();
    } else {
        return numAmount.toFixed(2);
    }
};

const currentYear = new Date().getFullYear();
const years = [
    "All",
    ...Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()),
];

const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
];

export default function PaymentIndex({
    payments,
    filters,
    amountsByCurrency = {},
    defaultCurrencyCode = "MYR",
    currencies = [],
}: Props) {
    const [status, setStatus] = useState(filters.status || "");
    const [selectedCurrency, setSelectedCurrency] = useState(
        filters.currency_code || ""
    );

    const [selectedYear, setSelectedYear] = useState(
        filters.payment_month
            ? filters.payment_month.length === 4
                ? filters.payment_month
                : filters.payment_month.split("-")[0]
            : "All"
    );
    const [selectedMonth, setSelectedMonth] = useState(
        filters.payment_month?.split("-")[1] || ""
    );

    const handleFilterChange = ({
        year,
        month,
        status,
        currency,
    }: {
        year: string;
        month: string;
        status: string;
        currency: string;
    }) => {
        // If year is "All", clear payment_month
        // If month is empty/not selected, send year only (for year-wide filtering)
        // If month is selected, send year-month
        const paymentMonth =
            year === "All" ? "" : month ? `${year}-${month}` : year;

        router.get(
            route("organization.payments.index"),
            {
                status: status || null,
                payment_month: paymentMonth || null,
                currency_code: currency || null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const [initialLoad, setInitialLoad] = useState(true);
    const [statusChangeDialog, setStatusChangeDialog] = useState<{
        open: boolean;
        payment: Payment | null;
        newStatus: "paid" | "unpaid" | null;
    }>({
        open: false,
        payment: null,
        newStatus: null,
    });

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            return;
        }

        handleFilterChange({
            year: selectedYear,
            month: selectedMonth,
            status: status,
            currency: selectedCurrency,
        });
    }, [selectedYear, selectedMonth, status, selectedCurrency]);

    const resetFilters = () => {
        setStatus("");
        setSelectedYear("All");
        setSelectedMonth("");
        setSelectedCurrency("");
        router.get(
            route("organization.payments.index"),
            {},
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            }
        );
    };

    const columns: ColumnDef<Payment>[] = [
        {
            header: "#",
            cell: ({ row }) => row.index + 1,
        },
        {
            header: "Student",
            cell: ({ row }) => row.original.student?.name || "-",
        },
        {
            header: "Amount",
            cell: ({ row }) => {
                const payment = row.original;
                const amount = payment.amount;
                const currencyCode = payment.currency_code;
                const currencySymbol = payment.currency?.symbol || currencyCode;

                // Use utility function to safely format amount
                const formattedAmount = formatAmount(amount, currencyCode);

                return (
                    <div className="text-right">
                        <div className="font-medium">
                            {currencyCode === "MYR" ? "RM " : currencySymbol}
                            {formattedAmount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {currencyCode}
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.status === "paid" ||
                        row.original.status === "success"
                            ? "default"
                            : "destructive"
                    }
                >
                    {row.original.status}
                </Badge>
            ),
        },
        { header: "Method", accessorKey: "method" },
        { header: "Payment Month", accessorKey: "payment_month" },
        { header: "Pay At", accessorKey: "pay_at" },
        {
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "organization.payments.edit",
                                    row.original.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        {row.original.status === "unpaid" && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatusChangeDialog({
                                        open: true,
                                        payment: row.original,
                                        newStatus: "paid",
                                    });
                                }}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark as
                                Paid
                            </DropdownMenuItem>
                        )}
                        {(row.original.status === "paid" ||
                            row.original.status === "success") && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatusChangeDialog({
                                        open: true,
                                        payment: row.original,
                                        newStatus: "unpaid",
                                    });
                                }}
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Mark as
                                Unpaid
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "organization.payments.destroy",
                                    row.original.id
                                )}
                                method="delete"
                                as="button"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route("invoice.show", {
                                    payment: row.original.id,
                                })}
                            >
                                <FileText className="w-4 h-4 mr-2" /> Invoice
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                const url = route("invoice.download", {
                                    payment: row.original.id,
                                });
                                window.open(url, "_blank");
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" /> Download
                            Invoice
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AuthenticatedLayout header="Payments">
            <Head title="Payments" />
            <div className="container mx-auto py-10 space-y-6">
                {/* Stats Cards */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                        Payment Overview
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20 col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                    Total Revenue
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-6 w-6 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                                    <div className="space-y-1">
                                        <div>
                                            {defaultCurrencyCode === "MYR"
                                                ? "RM"
                                                : defaultCurrencyCode}{" "}
                                            {formatAmount(
                                                amountsByCurrency[
                                                    defaultCurrencyCode
                                                ] || 0,
                                                defaultCurrencyCode
                                            )}
                                        </div>
                                        {Object.keys(amountsByCurrency).length >
                                            1 && (
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                {Object.entries(
                                                    amountsByCurrency
                                                )
                                                    .filter(
                                                        ([code]) =>
                                                            code !==
                                                            defaultCurrencyCode
                                                    )
                                                    .map(([code, amount]) => (
                                                        <div
                                                            key={code}
                                                            className="flex justify-between"
                                                        >
                                                            <span>{code}:</span>
                                                            <span>
                                                                {formatAmount(
                                                                    amount,
                                                                    code
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                    Total Payments
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-6 w-6 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                                    {payments.length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                    Paid
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-6 w-6 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                                    {
                                        payments.filter(
                                            (p) => p.status === "paid"
                                        ).length
                                    }
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                    Unpaid
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Hourglass className="h-6 w-6 text-yellow-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                                    {
                                        payments.filter(
                                            (p) => p.status === "unpaid"
                                        ).length
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Payments Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Payments</CardTitle>
                        <Link href={route("organization.payments.create")}>
                            <Button>Add Payment</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-end gap-4 flex-wrap">
                                {/* Year Filter */}
                                <div className="flex flex-col w-[160px]">
                                    <Label className="text-sm mb-1">Year</Label>
                                    <Select
                                        value={selectedYear}
                                        onValueChange={(value) => {
                                            setSelectedYear(value);
                                            if (value === "All")
                                                setSelectedMonth(""); // Clear month if "All" is selected
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map((year) => (
                                                <SelectItem
                                                    key={year}
                                                    value={year}
                                                >
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Month Filter */}
                                <div className="flex flex-col w-[160px]">
                                    <Label className="text-sm mb-1">
                                        Month
                                    </Label>
                                    <Select
                                        value={selectedMonth}
                                        onValueChange={(val) =>
                                            setSelectedMonth(
                                                val === "all" ? "" : val
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            {months.map((month) => (
                                                <SelectItem
                                                    key={month.value}
                                                    value={month.value}
                                                >
                                                    {month.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status Filter */}
                                <div className="flex flex-col w-[160px]">
                                    <Label className="text-sm mb-1">
                                        Status
                                    </Label>
                                    <Select
                                        value={status}
                                        onValueChange={(val) =>
                                            setStatus(val === "all" ? "" : val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="unpaid">
                                                Unpaid
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Currency Filter */}
                                <div className="flex flex-col w-[160px]">
                                    <Label className="text-sm mb-1">
                                        Currency
                                    </Label>
                                    <Select
                                        value={selectedCurrency}
                                        onValueChange={(val) =>
                                            setSelectedCurrency(
                                                val === "all" ? "" : val
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Currencies" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            {currencies.map((currency) => (
                                                <SelectItem
                                                    key={currency.code}
                                                    value={currency.code}
                                                >
                                                    {currency.code} -{" "}
                                                    {currency.symbol}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Reset Button */}
                                <div className="flex items-end">
                                    <Button
                                        variant="secondary"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* DataTable */}
                        <DataTable data={payments} columns={columns} />
                    </CardContent>
                </Card>
            </div>

            {/* Status Change Confirmation Dialog */}
            <Dialog
                open={statusChangeDialog.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setStatusChangeDialog({
                            open: false,
                            payment: null,
                            newStatus: null,
                        });
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Status Change</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to change the payment status
                            from{" "}
                            <strong>
                                {statusChangeDialog.payment?.status === "paid"
                                    ? "Paid"
                                    : "Unpaid"}
                            </strong>{" "}
                            to{" "}
                            <strong>
                                {statusChangeDialog.newStatus === "paid"
                                    ? "Paid"
                                    : "Unpaid"}
                            </strong>
                            ?
                        </DialogDescription>
                    </DialogHeader>
                    {statusChangeDialog.payment && (
                        <div className="py-4">
                            <div className="text-sm text-muted-foreground">
                                <p>
                                    <strong>Student:</strong>{" "}
                                    {statusChangeDialog.payment.student?.name}
                                </p>
                                <p>
                                    <strong>Amount:</strong>{" "}
                                    {statusChangeDialog.payment.currency
                                        ?.symbol || ""}
                                    {formatAmount(
                                        statusChangeDialog.payment.amount,
                                        statusChangeDialog.payment.currency_code
                                    )}{" "}
                                    {statusChangeDialog.payment.currency_code}
                                </p>
                                <p>
                                    <strong>Payment Month:</strong>{" "}
                                    {statusChangeDialog.payment.payment_month}
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setStatusChangeDialog({
                                    open: false,
                                    payment: null,
                                    newStatus: null,
                                });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (
                                    statusChangeDialog.payment &&
                                    statusChangeDialog.newStatus
                                ) {
                                    router.patch(
                                        route(
                                            "organization.payments.updateStatus",
                                            statusChangeDialog.payment.id
                                        ),
                                        {
                                            status: statusChangeDialog.newStatus,
                                        },
                                        {
                                            onSuccess: () => {
                                                setStatusChangeDialog({
                                                    open: false,
                                                    payment: null,
                                                    newStatus: null,
                                                });
                                            },
                                        }
                                    );
                                }
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
