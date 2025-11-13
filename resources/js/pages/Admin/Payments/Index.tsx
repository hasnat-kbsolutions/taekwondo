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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    FileText,
    CheckCircle,
    XCircle,
    Download,
    Upload,
    FileCheck,
    Wallet,
    Hourglass,
    BadgeCheck,
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Student {
    id: number;
    name: string;
    surname?: string;
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
    student_fee: {
        id: number;
        student: Student;
        fee_type: {
            id: number;
            name: string;
        };
        month: string;
    };
    amount: number;
    currency_code: string;
    currency?: {
        code: string;
        symbol: string;
        name: string;
    };
    status: "pending" | "successful" | "failed";
    method: string;
    pay_at: string;
    transaction_id?: string;
    notes?: string;
    attachment?: PaymentAttachment;
}

interface Props {
    payments: Payment[];
    students?: Student[];
    filters: {
        status?: string;
        month?: string;
        currency_code?: string;
        student_id?: string;
    };
    currencies: Array<{
        code: string;
        name: string;
        symbol: string;
    }>;
    totalPayments?: number;
    successfulPayments?: number;
    pendingPayments?: number;
    failedPayments?: number;
    amountsByCurrency?: Record<string, number>;
    defaultCurrencyCode?: string;
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

export default function PaymentIndex({
    payments,
    students = [],
    filters,
    currencies,
    totalPayments = 0,
    successfulPayments = 0,
    pendingPayments = 0,
    failedPayments = 0,
    amountsByCurrency = {},
    defaultCurrencyCode = "MYR",
}: Props) {
    const [status, setStatus] = useState(filters.status || "");
    const [selectedYear, setSelectedYear] = useState(
        filters.month
            ? filters.month.length === 4
                ? filters.month
                : filters.month.split("-")[0]
            : "All"
    );
    const [selectedMonth, setSelectedMonth] = useState(
        filters.month?.split("-")[1] || ""
    );
    const [selectedCurrency, setSelectedCurrency] = useState(
        filters.currency_code || ""
    );
    const [selectedStudent, setSelectedStudent] = useState(
        filters.student_id || ""
    );

    // Utility function to safely format amounts
    const formatAmount = (amount: any, currencyCode: string) => {
        const numAmount = Number(amount) || 0;

        if (currencyCode === "JPY") {
            return numAmount.toLocaleString();
        } else {
            return numAmount.toFixed(2);
        }
    };

    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );
    const [open, setOpen] = useState(false);
    const [selectedPaymentForProof, setSelectedPaymentForProof] =
        useState<Payment | null>(null);
    const [manageProofOpen, setManageProofOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [statusChangeDialog, setStatusChangeDialog] = useState<{
        open: boolean;
        payment: Payment | null;
        newStatus: "pending" | "successful" | "failed" | null;
    }>({
        open: false,
        payment: null,
        newStatus: null,
    });

    const { data, setData, post, processing, errors, reset } = useForm<{
        attachment: File | null;
    }>({
        attachment: null,
    });

    const openModal = (payment: Payment) => {
        setSelectedPayment(payment);
        setOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);

        if (file) {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
            setData("attachment", file);
        }
    };

    const handleUpload = () => {
        if (!data.attachment || !selectedPaymentForProof) {
            toast.error("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("attachment", data.attachment);
        if (selectedPaymentForProof.attachment?.id) {
            formData.append(
                "replace_attachment_id",
                selectedPaymentForProof.attachment.id.toString()
            );
        }

        router.post(
            route("admin.payments.upload-attachment", {
                payment: selectedPaymentForProof.id,
            }),
            formData,
            {
                onSuccess: () => {
                    toast.success(
                        selectedPaymentForProof.attachment
                            ? "Attachment updated successfully"
                            : "Attachment uploaded successfully"
                    );
                    setManageProofOpen(false);
                    setFilePreview(null);
                    setSelectedFile(null);
                    reset();
                    router.reload({ only: ["payments"] });
                },
                onError: () => {
                    toast.error("Failed to upload attachment");
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedPaymentForProof?.attachment) return;

        if (confirm("Are you sure you want to delete this attachment?")) {
            router.delete(
                route("admin.payments.delete-attachment", {
                    attachment: selectedPaymentForProof.attachment.id,
                }),
                {
                    onSuccess: () => {
                        toast.success("Attachment deleted successfully");
                        setManageProofOpen(false);
                        setSelectedPaymentForProof(null);
                        router.reload({ only: ["payments"] });
                    },
                    onError: () => {
                        toast.error("Failed to delete attachment");
                    },
                }
            );
        }
    };

    const handleFilterChange = ({
        year,
        month,
        status,
        currency,
        student,
    }: {
        year: string;
        month: string;
        status: string;
        currency: string;
        student: string;
    }) => {
        // Ensure a valid month format
        // - If year is "All", clear month
        // - If month is empty/not selected, send year only (for year-wide filtering)
        // - If month is selected, send year-month
        const monthFilter =
            year === "All" ? "" : month ? `${year}-${month}` : year;
        router.get(
            route("admin.payments.index"),
            {
                status: status || null,
                month: monthFilter || null,
                currency_code: currency || null,
                student_id: student || null,
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
            currency: selectedCurrency,
            student: selectedStudent,
        });
    }, [
        selectedYear,
        selectedMonth,
        status,
        selectedCurrency,
        selectedStudent,
    ]);

    const resetFilters = () => {
        setStatus("");
        setSelectedYear("All");
        setSelectedMonth("");
        setSelectedCurrency("");
        setSelectedStudent("");
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
            cell: ({ row }) => {
                const student = row.original.student_fee?.student;
                return student
                    ? `${student.name} ${student.surname || ""}`.trim()
                    : "-";
            },
        },
        {
            header: "Fee Type",
            cell: ({ row }) => row.original.student_fee?.fee_type?.name || "-",
        },
        {
            header: "Month",
            cell: ({ row }) => row.original.student_fee?.month || "-",
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
            cell: ({ row }) => {
                const status = row.original.status;
                const variant =
                    status === "successful"
                        ? "default"
                        : status === "pending"
                        ? "secondary"
                        : "destructive";
                return (
                    <Badge variant={variant}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
        },
        { header: "Method", accessorKey: "method" },
        { header: "Pay At", accessorKey: "pay_at" },
        {
            header: "Proof",
            cell: ({ row }) => {
                const payment = row.original;
                return (
                    <div className="flex items-center gap-2">
                        {payment.attachment ? (
                            <FileCheck className="w-4 h-4 text-primary" />
                        ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                    </div>
                );
            },
        },
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
                        {row.original.status === "pending" && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatusChangeDialog({
                                        open: true,
                                        payment: row.original,
                                        newStatus: "successful",
                                    });
                                }}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark as
                                Successful
                            </DropdownMenuItem>
                        )}
                        {row.original.status === "successful" && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatusChangeDialog({
                                        open: true,
                                        payment: row.original,
                                        newStatus: "pending",
                                    });
                                }}
                            >
                                <Hourglass className="w-4 h-4 mr-2" /> Mark as
                                Pending
                            </DropdownMenuItem>
                        )}
                        {row.original.status === "failed" && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatusChangeDialog({
                                        open: true,
                                        payment: row.original,
                                        newStatus: "successful",
                                    });
                                }}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark as
                                Successful
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedPaymentForProof(row.original);
                                setManageProofOpen(true);
                            }}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {row.original.attachment ? "Manage" : "Upload"}{" "}
                            Proof
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Payments
                            </CardTitle>
                            <Wallet className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalPayments || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Successful
                            </CardTitle>
                            <BadgeCheck className="h-6 w-6 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {successfulPayments || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Hourglass className="h-6 w-6 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">
                                {pendingPayments || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Failed
                            </CardTitle>
                            <XCircle className="h-6 w-6 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">
                                {failedPayments || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <Wallet className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 w-full">
                                <div className="text-lg font-bold">
                                    {defaultCurrencyCode === "MYR"
                                        ? "RM"
                                        : defaultCurrencyCode || ""}{" "}
                                    {formatAmount(
                                        amountsByCurrency?.[
                                            defaultCurrencyCode || "MYR"
                                        ] || 0,
                                        defaultCurrencyCode || "MYR"
                                    )}
                                </div>
                                {amountsByCurrency &&
                                    Object.keys(amountsByCurrency).length >
                                        1 && (
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            {Object.entries(amountsByCurrency)
                                                .filter(
                                                    ([code]) =>
                                                        code !==
                                                        defaultCurrencyCode
                                                )
                                                .map(([code, amount]) => (
                                                    <div key={code}>
                                                        {code === "MYR"
                                                            ? "RM"
                                                            : code}{" "}
                                                        {formatAmount(
                                                            amount,
                                                            code
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payments Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Payments</CardTitle>
                        <Link href={route("admin.payments.create")}>
                            <Button>Add Payment</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
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
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="successful">
                                                Successful
                                            </SelectItem>
                                            <SelectItem value="failed">
                                                Failed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

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

                                {students && students.length > 0 && (
                                    <div className="flex flex-col w-[160px]">
                                        <Label className="text-sm mb-1">
                                            Student
                                        </Label>
                                        <Select
                                            value={selectedStudent}
                                            onValueChange={(val) =>
                                                setSelectedStudent(
                                                    val === "all" ? "" : val
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Students" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All
                                                </SelectItem>
                                                {students.map((student) => (
                                                    <SelectItem
                                                        key={student.id}
                                                        value={String(
                                                            student.id
                                                        )}
                                                    >
                                                        {student.name}{" "}
                                                        {student.surname || ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

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
                                    {selectedPayment.student_fee?.student?.name}{" "}
                                    {selectedPayment.student_fee?.student
                                        ?.surname || ""}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Fee Type:</strong>{" "}
                                    {
                                        selectedPayment.student_fee?.fee_type
                                            ?.name
                                    }
                                </p>
                                <p className="flex justify-between">
                                    <strong>Amount:</strong>{" "}
                                    {selectedPayment.currency?.symbol || "RM"}{" "}
                                    {selectedPayment.amount} (
                                    {selectedPayment.currency_code})
                                </p>
                                <p className="flex justify-between">
                                    <strong>Status:</strong>{" "}
                                    {selectedPayment.status
                                        ?.charAt(0)
                                        .toUpperCase() +
                                        selectedPayment.status?.slice(1)}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Method:</strong>{" "}
                                    {selectedPayment.method}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Month:</strong>{" "}
                                    {selectedPayment.student_fee?.month}
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

                {/* Attachment Management Dialog */}
                <Dialog
                    open={manageProofOpen}
                    onOpenChange={setManageProofOpen}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedPaymentForProof?.attachment
                                    ? "Update Payment Proof"
                                    : "Upload Payment Proof"}
                            </DialogTitle>
                            <DialogDescription>
                                Upload an image or PDF as proof of payment. Max
                                5MB.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Show current attachment if exists */}
                            {selectedPaymentForProof?.attachment &&
                                !selectedFile && (
                                    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 flex-1">
                                                <FileCheck className="w-5 h-5 text-primary" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {
                                                            selectedPaymentForProof
                                                                .attachment
                                                                .original_filename
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {selectedPaymentForProof.attachment.file_type.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Show preview if image */}
                                        {selectedPaymentForProof.attachment.file_type.match(
                                            /^(jpg|jpeg|png|gif|webp)$/i
                                        ) && (
                                            <div className="border rounded-lg overflow-hidden">
                                                <img
                                                    src={`/storage/${selectedPaymentForProof.attachment.file_path}`}
                                                    alt="Current proof"
                                                    className="w-full h-auto max-h-64 object-contain bg-white"
                                                />
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => {
                                                    if (
                                                        selectedPaymentForProof?.attachment
                                                    ) {
                                                        window.open(
                                                            route(
                                                                "admin.payments.download-attachment",
                                                                {
                                                                    attachment:
                                                                        selectedPaymentForProof
                                                                            .attachment
                                                                            .id,
                                                                }
                                                            ),
                                                            "_blank"
                                                        );
                                                    }
                                                }}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="flex-1"
                                                onClick={handleDelete}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            {/* File Preview */}
                            {filePreview && (
                                <div className="space-y-2">
                                    <Label>Preview</Label>
                                    <div className="border rounded-lg overflow-hidden bg-muted/50">
                                        <img
                                            src={filePreview}
                                            alt="Preview"
                                            className="w-full h-auto max-h-64 object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Upload/Update form */}
                            {(!selectedPaymentForProof?.attachment ||
                                selectedFile) && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpload();
                                    }}
                                >
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="attachment">
                                                Select File
                                            </Label>
                                            <input
                                                id="attachment"
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={handleFileSelect}
                                                className="file:border-0 file:bg-primary file:text-primary-foreground file:rounded-md file:px-4 file:py-2 file:mr-4 text-sm"
                                            />
                                            {errors.attachment && (
                                                <p className="text-sm text-red-600">
                                                    {errors.attachment}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <DialogFooter className="gap-2 mt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                if (selectedFile) {
                                                    setSelectedFile(null);
                                                    setFilePreview(null);
                                                    reset();
                                                } else {
                                                    setManageProofOpen(false);
                                                    setSelectedPaymentForProof(
                                                        null
                                                    );
                                                    reset();
                                                }
                                            }}
                                        >
                                            {selectedFile ? "Cancel" : "Close"}
                                        </Button>
                                        {selectedFile && (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? "Uploading..."
                                                    : selectedPaymentForProof?.attachment
                                                    ? "Replace"
                                                    : "Upload"}
                                            </Button>
                                        )}
                                    </DialogFooter>
                                </form>
                            )}

                            {/* Hidden file input for replace button */}
                            <input
                                id="attachment-hidden"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Show replace option button when attachment exists but no file selected */}
                            {selectedPaymentForProof?.attachment &&
                                !selectedFile && (
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                document
                                                    .getElementById(
                                                        "attachment-hidden"
                                                    )
                                                    ?.click();
                                            }}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Replace with New File
                                        </Button>
                                    </DialogFooter>
                                )}
                        </div>
                    </DialogContent>
                </Dialog>

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
                                Are you sure you want to change the payment
                                status from{" "}
                                <strong>
                                    {statusChangeDialog.payment?.status
                                        ? statusChangeDialog.payment.status
                                              .charAt(0)
                                              .toUpperCase() +
                                          statusChangeDialog.payment.status.slice(
                                              1
                                          )
                                        : "Unknown"}
                                </strong>{" "}
                                to{" "}
                                <strong>
                                    {statusChangeDialog.newStatus
                                        ? statusChangeDialog.newStatus
                                              .charAt(0)
                                              .toUpperCase() +
                                          statusChangeDialog.newStatus.slice(1)
                                        : "Unknown"}
                                </strong>
                                ?
                            </DialogDescription>
                        </DialogHeader>
                        {statusChangeDialog.payment && (
                            <div className="py-4">
                                <div className="text-sm text-muted-foreground">
                                    <p>
                                        <strong>Student:</strong>{" "}
                                        {
                                            statusChangeDialog.payment
                                                .student_fee?.student?.name
                                        }{" "}
                                        {statusChangeDialog.payment.student_fee
                                            ?.student?.surname || ""}
                                    </p>
                                    <p>
                                        <strong>Amount:</strong>{" "}
                                        {statusChangeDialog.payment.currency
                                            ?.symbol || ""}
                                        {formatAmount(
                                            statusChangeDialog.payment.amount,
                                            statusChangeDialog.payment
                                                .currency_code
                                        )}{" "}
                                        {
                                            statusChangeDialog.payment
                                                .currency_code
                                        }
                                    </p>
                                    <p>
                                        <strong>Month:</strong>{" "}
                                        {
                                            statusChangeDialog.payment
                                                .student_fee?.month
                                        }
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
                                                "admin.payments.updateStatus",
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
            </div>
        </AuthenticatedLayout>
    );
}
