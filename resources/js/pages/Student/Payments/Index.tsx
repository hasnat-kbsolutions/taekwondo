import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router, Link, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    Coins,
    BadgeCheck,
    Hourglass,
    Wallet,
    FileText,
    Download,
    XCircle,
    Upload,
    FileCheck,
    Trash2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 31 }, (_, i) => currentYear - 15 + i); // [currentYear -15, ..., currentYear +15]

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
    amount: number;
    method: string;
    status: string;
    payment_month: string;
    pay_at: string;
    notes?: string;
    currency_code?: string;
    attachment?: PaymentAttachment; // Single attachment
    currency?: {
        code: string;
        symbol: string;
    };
}

interface Props {
    year: number;
    payments: Payment[];
    totalPayments?: number;
    paidPayments?: number;
    pendingPayments?: number;
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

// Utility function to format file size
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export default function Payment({
    year,
    payments,
    totalPayments,
    paidPayments,
    pendingPayments,
    unpaidPayments,
    amountsByCurrency,
    defaultCurrencyCode,
}: Props) {
    const [selectedYear, setSelectedYear] = useState(year || currentYear);

    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);
        router.get(route("student.payments.index"), { year: newYear });
    };

    const resetFilters = () => {
        setSelectedYear(currentYear);
        router.get(route("student.payments.index"), { year: currentYear });
    };

    const columns: ColumnDef<Payment>[] = [
        {
            header: "#",
            cell: ({ row }) => row.index + 1,
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
            header: "Method",
            accessorKey: "method",
        },
        {
            header: "Status",
            cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.original.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {row.original.status}
                </span>
            ),
        },
        {
            header: "Payment Month",
            accessorKey: "payment_month",
        },
        {
            header: "Pay At",
            cell: ({ row }) =>
                row.original.pay_at
                    ? format(new Date(row.original.pay_at), "MMM dd, yyyy")
                    : "-",
        },
        {
            header: "Notes",
            cell: ({ row }) => row.original.notes || "-",
        },
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
                                href={route("invoice.show", {
                                    payment: row.original.id,
                                })}
                            >
                                <FileText className="w-4 h-4 mr-2" /> View
                                Invoice
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
                                setSelectedPayment(row.original);
                                setDialogOpen(true);
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

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        attachment: File | null;
    }>({
        attachment: null,
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);

        if (file) {
            // Create preview for images
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
        if (!data.attachment || !selectedPayment) {
            toast.error("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("attachment", data.attachment);
        if (selectedPayment.attachment?.id) {
            formData.append(
                "replace_attachment_id",
                selectedPayment.attachment.id.toString()
            );
        }

        router.post(
            route("student.payments.upload-attachment", {
                payment: selectedPayment.id,
            }),
            formData,
            {
                onSuccess: () => {
                    toast.success(
                        selectedPayment.attachment
                            ? "Attachment updated successfully"
                            : "Attachment uploaded successfully"
                    );
                    setDialogOpen(false);
                    setFilePreview(null);
                    setSelectedFile(null);
                    reset();
                },
                onError: () => {
                    toast.error("Failed to upload attachment");
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedPayment?.attachment) return;

        if (confirm("Are you sure you want to delete this attachment?")) {
            router.delete(
                route("student.payments.delete-attachment", {
                    attachment: selectedPayment.attachment.id,
                }),
                {
                    onSuccess: () => {
                        toast.success("Attachment deleted successfully");
                        setDialogOpen(false);
                        setSelectedPayment(null);
                        router.reload({ only: ["payments"] });
                    },
                    onError: () => {
                        toast.error("Failed to delete attachment");
                    },
                }
            );
        }
    };

    return (
        <AuthenticatedLayout header="My Payments">
            <Head title="My Payments" />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPayment?.attachment
                                ? "Update Payment Proof"
                                : "Upload Payment Proof"}
                        </DialogTitle>
                        <DialogDescription>
                            Upload an image or PDF as proof of payment. Max 5MB.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Show current attachment if exists */}
                        {selectedPayment?.attachment && !selectedFile && (
                            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1">
                                        <FileCheck className="w-5 h-5 text-primary" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {
                                                    selectedPayment.attachment
                                                        .original_filename
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedPayment.attachment.file_type.toUpperCase()}{" "}
                                                •{" "}
                                                {formatFileSize(
                                                    selectedPayment.attachment
                                                        .file_size
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Show preview if image */}
                                {selectedPayment.attachment.file_type.match(
                                    /^(jpg|jpeg|png|gif|webp)$/i
                                ) && (
                                    <div className="border rounded-lg overflow-hidden">
                                        <img
                                            src={`/storage/${selectedPayment.attachment.file_path}`}
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
                                            if (selectedPayment?.attachment) {
                                                window.open(
                                                    route(
                                                        "student.payments.download-attachment",
                                                        {
                                                            attachment:
                                                                selectedPayment
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

                        {/* Upload/Update form - only show if no attachment exists or user selected a file */}
                        {(!selectedPayment?.attachment || selectedFile) && (
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
                                                // Clear selection, show current attachment again
                                                setSelectedFile(null);
                                                setFilePreview(null);
                                                reset();
                                            } else {
                                                // Close dialog
                                                setDialogOpen(false);
                                                setSelectedPayment(null);
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
                                                : selectedPayment?.attachment
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
                        {selectedPayment?.attachment && !selectedFile && (
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        document
                                            .getElementById("attachment-hidden")
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

            <div className="container mx-auto py-10 space-y-6">
                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
                            <div className="flex flex-col w-[180px]">
                                <Label className="text-sm mb-1">Year</Label>
                                <Select
                                    onValueChange={handleYearChange}
                                    value={selectedYear.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
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
                                Unpaid
                            </CardTitle>
                            <XCircle className="h-6 w-6 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
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
                    <CardHeader>
                        <CardTitle>My Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={payments} columns={columns} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
