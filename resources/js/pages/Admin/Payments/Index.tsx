import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Student {
    id: number;
    name: string;
}

interface Payment {
    id: number;
    student: Student;
    amount: number;
    status: string;
    method: string;
    payment_month: string;
    pay_at: string;
    notes?: string;
}

interface Props {
    payments: Payment[];
    filters: {
        status?: string;
        payment_month?: string;
    };
}

// Add "All" option to years
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

export default function PaymentIndex({ payments, filters }: Props) {
    const [status, setStatus] = useState(filters.status || "");
    const [selectedYear, setSelectedYear] = useState(
        filters.payment_month?.split("-")[0] || currentYear.toString()
    );
    const [selectedMonth, setSelectedMonth] = useState(
        filters.payment_month?.split("-")[1] || ""
    );

    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );
    const [open, setOpen] = useState(false);

    const openModal = (payment: Payment) => {
        setSelectedPayment(payment);
        setOpen(true);
    };

    const handleFilterChange = ({
        year,
        month,
        status,
    }: {
        year: string;
        month: string;
        status: string;
    }) => {
        // Ensure a valid payment_month format (default to "01" if no month selected, clear if year is "All")
        const paymentMonth =
            year === "All" ? "" : month ? `${year}-${month}` : `${year}-01`; // Default to January if no month
        console.log("Filter Values:", { year, month, status, paymentMonth }); // Debug log
        router.get(
            route("admin.payments.index"),
            {
                status: status || null,
                payment_month: paymentMonth || null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            return;
        }
        handleFilterChange({
            year: selectedYear,
            month: selectedMonth,
            status: status,
        });
    }, [selectedYear, selectedMonth, status]);

    const resetFilters = () => {
        setStatus("");
        setSelectedYear(currentYear.toString());
        setSelectedMonth("");
        router.get(
            route("admin.payments.index"),
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
        { header: "Amount", accessorKey: "amount" },
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
                        <DropdownMenuItem
                            onClick={() => openModal(row.original)}
                        >
                            <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.payments.edit",
                                    row.original.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.payments.destroy",
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
                                href={route("admin.payments.invoice", {
                                    payment: row.original.id,
                                })}
                            >
                                <FileText className="w-4 h-4 mr-2" /> Invoice
                            </Link>
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
                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
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
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col w-[160px]">
                                <Label className="text-sm mb-1">Month</Label>
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
                                        <SelectItem value="all">All</SelectItem>
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

                            <div className="flex flex-col w-[160px]">
                                <Label className="text-sm mb-1">Status</Label>
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
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="paid">
                                            Paid
                                        </SelectItem>
                                        <SelectItem value="unpaid">
                                            Unpaid
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button onClick={resetFilters}>
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Payments</CardTitle>
                        <Link href={route("admin.payments.create")}>
                            <Button>Add Payment</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={payments} columns={columns} />
                    </CardContent>
                </Card>

                {/* Modal */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="w-full">
                        <DialogHeader>
                            <DialogTitle className="text-3xl text-foreground">
                                Edit Payment
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Update payment details like amount and status.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedPayment && (
                            <div className="space-y-2 text-sm ">
                                <p className="flex justify-between">
                                    <strong>Student:</strong>{" "}
                                    {selectedPayment.student?.name}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Amount:</strong> RM{" "}
                                    {selectedPayment.amount}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Status:</strong>{" "}
                                    {selectedPayment.status}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Method:</strong>{" "}
                                    {selectedPayment.method}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Payment Month:</strong>{" "}
                                    {selectedPayment.payment_month}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Pay At:</strong>{" "}
                                    {selectedPayment.pay_at}
                                </p>
                                {selectedPayment.notes && (
                                    <p className="flex justify-between">
                                        <strong>Notes:</strong>{" "}
                                        {selectedPayment.notes}
                                    </p>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
