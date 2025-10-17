import React, { useState } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    GraduationCap,
    Coins,
    BadgeCheck,
    Hourglass,
    Star,
    Calendar,
    TrendingUp,
    Wallet,
} from "lucide-react";
import RatingStars from "@/components/RatingStars";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 31 }, (_, i) => currentYear - 15 + i); // [currentYear -15, ..., currentYear +15]

interface AttendanceStats {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
}

interface PaymentStats {
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    totalAmount: number;
    paidAmount: number;
}

interface RatingStats {
    averageRating: number;
    totalRatings: number;
}

interface Props {
    year: number;
    attendanceStats: AttendanceStats;
    paymentStats: PaymentStats;
    ratingStats: RatingStats;
    amountsByCurrency?: Record<string, number>;
    paidAmountsByCurrency?: Record<string, number>;
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

export default function Dashboard({
    year,
    attendanceStats,
    paymentStats,
    ratingStats,
    amountsByCurrency,
    paidAmountsByCurrency,
    defaultCurrencyCode,
}: Props) {
    const [selectedYear, setSelectedYear] = useState(year || currentYear);

    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);
        router.get(route("student.dashboard"), { year: newYear });
    };

    const resetFilters = () => {
        setSelectedYear(currentYear);
        router.get(route("student.dashboard"), { year: currentYear });
    };

    return (
        <AuthenticatedLayout header="Student Dashboard">
            <Head title="Student Dashboard" />

            <div className="container mx-auto py-8">
                {/* Year Selector */}
                <div className="mb-6">
                    <div className="flex items-end gap-4 flex-wrap">
                        <div className="flex flex-col w-[180px]">
                            <label className="block text-sm font-medium mb-1">
                                Select Year
                            </label>
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
                </div>

                {/* Main Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Days
                            </CardTitle>
                            <Calendar className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {attendanceStats.totalDays}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Present Days
                            </CardTitle>
                            <BadgeCheck className="h-6 w-6 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {attendanceStats.presentDays}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Absent Days
                            </CardTitle>
                            <Hourglass className="h-6 w-6 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">
                                {attendanceStats.absentDays}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Attendance Rate
                            </CardTitle>
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {attendanceStats.attendanceRate}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Payments
                            </CardTitle>
                            <Wallet className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {paymentStats.totalPayments}
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
                                {paymentStats.paidPayments}
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
                                {paymentStats.pendingPayments}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Amount
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

                {/* Rating Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Rating
                            </CardTitle>
                            <Star className="h-6 w-6 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <RatingStars
                                    rating={Math.round(
                                        ratingStats.averageRating || 0
                                    )}
                                    readonly
                                    size="sm"
                                />
                                <span className="text-2xl font-bold">
                                    {(ratingStats.averageRating || 0).toFixed(
                                        1
                                    )}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Ratings
                            </CardTitle>
                            <Star className="h-6 w-6 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {ratingStats.totalRatings || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
