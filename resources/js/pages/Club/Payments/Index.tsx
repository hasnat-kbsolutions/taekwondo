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
    Coins,
    BadgeCheck,
    Hourglass,
    Wallet,
    CheckCircle,
    XCircle,
    Download,
    Upload,
    FileCheck,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    status: string;
    method: string;
    payment_month: string;
    pay_at: string;
    notes?: string;
    currency_code?: string;
    attachment?: PaymentAttachment;
    currency?: {
        code: string;
        symbol: string;
    };
}

interface Props {
    payments: Payment[];
    filters: {
        status?: string;
        payment_month?: string;
    };
    totalPayments?: number;
    paidPayments?: number;
    unpaidPayments?: number;
    amountsByCurrency?: Record<string, number>;
    defaultCurrencyCode?: string;
}

// Utility function to safely format amounts
const formatAmount = (amount: any, currencyCode: string = "MYR") => {
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
    totalPayments,
    paidPayments,
    unpaidPayments,
    amountsByCurrency,
    defaultCurrencyCode,
}: Props) {
    const [status, setStatus] = useState(filters.status || "");
    const [selectedPaymentForProof, setSelectedPaymentForProof] =
        useState<Payment | null>(null);
    const [manageProofOpen, setManageProofOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        attachment: File | null;
    }>({
        attachment: null,
    });

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
            route("club.payments.upload-attachment", {
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
                route("club.payments.delete-attachment", {
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
    }: {
        year: string;
        month: string;
        status: string;
    }) => {
        // If year is "All", clear payment_month
        // If month is empty/not selected, send year only (for year-wide filtering)
        // If month is selected, send year-month
        const paymentMonth =
            year === "All" ? "" : month ? `${year}-${month}` : year;

        router.get(
            route("club.payments.index"),
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
        });
    }, [selectedYear, selectedMonth, status]);

    const resetFilters = () => {
        setStatus("");
        setSelectedYear("All");
        setSelectedMonth("");
        router.get(
            route("club.payments.index"),
            {},
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            }
        );
    };

    // Define columns inside component to access state handlers
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
                const currencySymbol = row.original.currency?.symbol || "RM";
                const currencyCode = row.original.currency_code || "MYR";
                return `${currencySymbol} ${formatAmount(
                    row.original.amount,
                    currencyCode
                )}`;
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
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "club.payments.edit",
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
                                    "club.payments.destroy",
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
                                Paid
                            </CardTitle>
                            <BadgeCheck className="h-6 w-6 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {paidPayments || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Unpaid
                            </CardTitle>
                            <Hourglass className="h-6 w-6 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">
                                {unpaidPayments || 0}
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
                                        : defaultCurrencyCode}{" "}
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
                        </CardContent>
                    </Card>
                </div>

                {/* Payments Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Payments</CardTitle>
                        <Link href={route("club.payments.create")}>
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

                {/* Manage Proof Dialog */}
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
                                                                "club.payments.download-attachment",
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
                                    {statusChangeDialog.payment?.status ===
                                    "paid"
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
                                        {
                                            statusChangeDialog.payment.student
                                                ?.name
                                        }
                                    </p>
                                    <p>
                                        <strong>Amount:</strong>{" "}
                                        {statusChangeDialog.payment.currency
                                            ?.symbol || ""}
                                        {formatAmount(
                                            statusChangeDialog.payment.amount,
                                            statusChangeDialog.payment
                                                .currency_code || "MYR"
                                        )}{" "}
                                        {statusChangeDialog.payment
                                            .currency_code || "MYR"}
                                    </p>
                                    <p>
                                        <strong>Payment Month:</strong>{" "}
                                        {
                                            statusChangeDialog.payment
                                                .payment_month
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
                                                "club.payments.updateStatus",
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
