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
    AlertCircle,
    MapPin,
    Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";
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

interface Event {
    id: number;
    title: string;
    description?: string;
    event_type: string;
    event_date: string;
    start_time?: string;
    venue?: string;
}

interface FeePlan {
    id: number;
    plan_name: string;
    base_amount: number;
    effective_amount: number;
    currency_code: string;
    interval: string;
    discount_type?: string;
    discount_value?: number;
    is_active: boolean;
    effective_from?: string;
    next_due_date?: string;
}

interface Props {
    year: number;
    attendanceStats: AttendanceStats;
    paymentStats: PaymentStats;
    ratingStats: RatingStats;
    amountsByCurrency?: Record<string, number>;
    paidAmountsByCurrency?: Record<string, number>;
    defaultCurrencyCode?: string;
    upcomingEvents?: Event[];
    feePlan?: FeePlan | null;
    unpaidFeesCount?: number;
    unpaidAmount?: number;
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
    upcomingEvents = [],
    feePlan,
    unpaidFeesCount = 0,
    unpaidAmount = 0,
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

                {/* Fee Plan and Unpaid Fees Alert */}
                {feePlan && unpaidFeesCount > 0 && (
                    <Card className="mb-6 border-l-4 border-red-500">
                        <CardContent className="pt-4 pb-4 px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-red-700">Outstanding Fees</p>
                                        <p className="text-xs text-gray-600">{unpaidFeesCount} payment{unpaidFeesCount === 1 ? "" : "s"} due</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-lg font-bold text-red-700">
                                        {defaultCurrencyCode === "MYR" ? "RM" : defaultCurrencyCode}{" "}
                                        {formatAmount(unpaidAmount, defaultCurrencyCode)}
                                    </p>
                                    <p className="text-xs text-gray-600">{feePlan.plan_name}</p>
                                </div>
                                <Link
                                    href={route("student.payments.index")}
                                    className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline px-3 py-2 rounded hover:bg-red-50 whitespace-nowrap flex-shrink-0"
                                >
                                    View
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Fee Plan Information Card */}
                {feePlan && unpaidFeesCount === 0 && (
                    <Card className="mb-6 border-l-4 border-green-500">
                        <CardContent className="pt-4 pb-4 px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <BadgeCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-green-700">All Payments Paid</p>
                                        <p className="text-xs text-gray-600">{feePlan.plan_name} • {feePlan.interval}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-lg font-bold text-green-700">
                                        {defaultCurrencyCode === "MYR" ? "RM" : defaultCurrencyCode}{" "}
                                        {formatAmount(feePlan.effective_amount, feePlan.currency_code)}
                                    </p>
                                    <Badge variant={feePlan.is_active ? "default" : "secondary"} className="text-xs mt-1">
                                        {feePlan.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Upcoming Events Alert */}
                {upcomingEvents && upcomingEvents.length > 0 && (
                    <Card className="mb-6 border-orange-500 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                    <CardTitle className="text-lg">
                                        Upcoming Events
                                    </CardTitle>
                                </div>
                                <Link
                                    href={route("student.events.index")}
                                    className="text-sm text-primary hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-3">
                                {upcomingEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={route(
                                            "student.events.show",
                                            event.id
                                        )}
                                        className="block"
                                    >
                                        <div className="p-3 rounded-lg border bg-white dark:bg-gray-800 hover:bg-accent/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h4 className="font-semibold text-sm line-clamp-1">
                                                    {event.title}
                                                </h4>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs shrink-0"
                                                >
                                                    {event.event_type}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {new Date(
                                                            event.event_date
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                                {event.start_time && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3 w-3" />
                                                        <span>
                                                            {(() => {
                                                                const [
                                                                    hours,
                                                                    minutes,
                                                                ] =
                                                                    event.start_time.split(
                                                                        ":"
                                                                    );
                                                                const hour =
                                                                    parseInt(
                                                                        hours
                                                                    );
                                                                const ampm =
                                                                    hour >= 12
                                                                        ? "PM"
                                                                        : "AM";
                                                                const displayHour =
                                                                    hour % 12 ||
                                                                    12;
                                                                return `${displayHour}:${minutes} ${ampm}`;
                                                            })()}
                                                        </span>
                                                    </div>
                                                )}
                                                {event.venue && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="line-clamp-1">
                                                            {event.venue}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

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
                                Unpaid
                            </CardTitle>
                            <Hourglass className="h-6 w-6 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">
                                {paymentStats.pendingPayments}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
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

                    <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Paid Amount
                            </CardTitle>
                            <BadgeCheck className="h-6 w-6 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 w-full">
                                <div className="text-lg font-bold text-green-600">
                                    {defaultCurrencyCode === "MYR"
                                        ? "RM"
                                        : defaultCurrencyCode}{" "}
                                    {formatAmount(
                                        paidAmountsByCurrency?.[
                                            defaultCurrencyCode || "MYR"
                                        ] || 0,
                                        defaultCurrencyCode || "MYR"
                                    )}
                                </div>
                                {paidAmountsByCurrency &&
                                    Object.keys(paidAmountsByCurrency).length >
                                        1 && (
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            {Object.entries(paidAmountsByCurrency)
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
