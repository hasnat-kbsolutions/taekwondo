import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react";

interface Student {
    id: number;
    name: string;
    surname?: string;
}

interface FeeType {
    id: number;
    name: string;
}

interface StudentFee {
    id: number;
    student: Student;
    fee_type: FeeType;
    month: string;
    amount: number;
    discount: number;
    fine: number;
    paid_amount: number;
    status: "pending" | "partial" | "paid";
    due_date: string | null;
}

interface Props {
    studentFees: StudentFee[];
    students: Student[];
    feeTypes: FeeType[];
    filters: {
        student_id?: string;
        fee_type_id?: string;
        status?: string;
        month?: string;
    };
    totalFees: number;
    pendingFees: number;
    partialFees: number;
    paidFees: number;
}

export default function Index({
    studentFees,
    students = [],
    feeTypes = [],
    filters,
    totalFees,
    pendingFees,
    partialFees,
    paidFees,
}: Props) {
    const [selectedStudent, setSelectedStudent] = useState(
        filters.student_id || "all"
    );
    const [selectedFeeType, setSelectedFeeType] = useState(
        filters.fee_type_id || "all"
    );
    const [selectedStatus, setSelectedStatus] = useState(
        filters.status || "all"
    );
    const [selectedMonth, setSelectedMonth] = useState(filters.month || "");

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this student fee?")) {
            router.delete(route("admin.student-fees.destroy", id));
        }
    };

    const handleFilter = () => {
        router.get(
            route("admin.student-fees.index"),
            {
                student_id: selectedStudent !== "all" ? selectedStudent : null,
                fee_type_id: selectedFeeType !== "all" ? selectedFeeType : null,
                status: selectedStatus !== "all" ? selectedStatus : null,
                month: selectedMonth || null,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const resetFilters = () => {
        setSelectedStudent("all");
        setSelectedFeeType("all");
        setSelectedStatus("all");
        setSelectedMonth("");
        router.get(
            route("admin.student-fees.index"),
            {},
            {
                preserveScroll: true,
                preserveState: false,
            }
        );
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: "secondary",
            partial: "default",
            paid: "default",
        };
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            partial: "bg-blue-100 text-blue-800",
            paid: "bg-green-100 text-green-800",
        };
        return (
            <Badge variant={variants[status as keyof typeof variants] as any}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout header="Student Fees">
            <Head title="Student Fees" />
            <div className="container mx-auto py-10 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Fees
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalFees || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {pendingFees || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Partial
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {partialFees || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Paid
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {paidFees || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Student Fees</CardTitle>
                        <Link href={route("admin.student-fees.create")}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Student Fee
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Label className="text-sm mb-1">
                                        Student
                                    </Label>
                                    <Select
                                        value={selectedStudent}
                                        onValueChange={setSelectedStudent}
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
                                                    value={String(student.id)}
                                                >
                                                    {student.name}{" "}
                                                    {student.surname || ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm mb-1">
                                        Fee Type
                                    </Label>
                                    <Select
                                        value={selectedFeeType}
                                        onValueChange={setSelectedFeeType}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Fee Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            {feeTypes.map((feeType) => (
                                                <SelectItem
                                                    key={feeType.id}
                                                    value={String(feeType.id)}
                                                >
                                                    {feeType.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm mb-1">
                                        Status
                                    </Label>
                                    <Select
                                        value={selectedStatus}
                                        onValueChange={setSelectedStatus}
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
                                            <SelectItem value="partial">
                                                Partial
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm mb-1">
                                        Month (YYYY-MM)
                                    </Label>
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) =>
                                            setSelectedMonth(e.target.value)
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleFilter}>Filter</Button>
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {studentFees.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Fee Type</TableHead>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Discount</TableHead>
                                        <TableHead>Fine</TableHead>
                                        <TableHead>Paid</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentFees.map((studentFee) => (
                                        <TableRow key={studentFee.id}>
                                            <TableCell className="font-medium">
                                                {studentFee.student?.name}{" "}
                                                {studentFee.student?.surname ||
                                                    ""}
                                            </TableCell>
                                            <TableCell>
                                                {studentFee.fee_type?.name}
                                            </TableCell>
                                            <TableCell>
                                                {studentFee.month}
                                            </TableCell>
                                            <TableCell>
                                                RM{" "}
                                                {parseFloat(
                                                    studentFee.amount.toString()
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                RM{" "}
                                                {parseFloat(
                                                    studentFee.discount.toString()
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                RM{" "}
                                                {parseFloat(
                                                    studentFee.fine.toString()
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                RM{" "}
                                                {parseFloat(
                                                    studentFee.paid_amount.toString()
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(
                                                    studentFee.status
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {studentFee.due_date
                                                    ? new Date(
                                                          studentFee.due_date
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "admin.student-fees.edit",
                                                                    studentFee.id
                                                                )}
                                                            >
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    studentFee.id
                                                                )
                                                            }
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">
                                    No student fees found.
                                </p>
                                <Link href={route("admin.student-fees.create")}>
                                    <Button className="mt-4">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Student Fee
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
