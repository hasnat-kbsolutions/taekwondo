import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    GraduationCap,
    Coins,
    BadgeCheck,
    Hourglass,
    Users,
    Star,
    Calendar,
    Award,
    ArrowRight,
    Wallet,
    MapPin,
    Clock,
    AlertCircle,
    FileText,
    CheckCircle,
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link } from "@inertiajs/react";
import RatingStars from "@/components/RatingStars";

interface Event {
    id: number;
    title: string;
    description?: string;
    event_type: string;
    event_date: string;
    start_time?: string;
    venue?: string;
}

interface PaymentAttachment {
    id: number;
    payment_id: number;
    file_path: string;
    original_filename: string;
    file_type: string;
    file_size: number;
    created_at: string;
    payment: {
        id: number;
        amount: number;
        currency_code: string;
        student: {
            id: number;
            name: string;
            surname?: string;
        };
        currency?: {
            symbol: string;
            code: string;
        };
    };
}

interface Props {
    studentsCount: number;
    instructorsCount: number;
    paymentsCount: number;
    paidCount: number;
    pendingCount: number;
    totalAmount: number;
    avgStudentRating: number;
    avgInstructorRating: number;
    totalRatings: number;
    totalAttendanceDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
    certificationsCount: number;
    amountsByCurrency?: Record<string, number>;
    defaultCurrencyCode?: string;
    upcomingEvents?: Event[];
    paymentProofs?: PaymentAttachment[];
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

export default function DashboardCards({
    studentsCount,
    instructorsCount,
    paymentsCount,
    paidCount,
    pendingCount,
    totalAmount,
    avgStudentRating,
    avgInstructorRating,
    totalRatings,
    totalAttendanceDays,
    presentDays,
    absentDays,
    attendanceRate,
    certificationsCount,
    amountsByCurrency,
    defaultCurrencyCode,
    upcomingEvents = [],
    paymentProofs = [],
}: Props) {
    const stats = [
        {
            label: "Students",
            count: studentsCount,
            icon: <GraduationCap className="h-6 w-6 text-primary" />,
            url: route("club.students.index"),
        },
        {
            label: "Instructors",
            count: instructorsCount,
            icon: <Users className="h-6 w-6 text-primary" />,
            url: route("club.instructors.index"),
        },
        {
            label: "Total Payments",
            count: paymentsCount,
            icon: <Wallet className="h-6 w-6 text-primary" />,
            url: route("club.payments.index"),
        },
        {
            label: "Paid",
            count: paidCount,
            icon: <BadgeCheck className="h-6 w-6 text-green-600" />,
            url: route("club.payments.index"),
        },
        {
            label: "Unpaid",
            count: pendingCount,
            icon: <Hourglass className="h-6 w-6 text-yellow-500" />,
            url: route("club.payments.index"),
        },
        {
            label: "Total Amount",
            count: (
                <div className="space-y-1 w-full">
                    <div className="text-lg font-bold">
                        {defaultCurrencyCode === "MYR"
                            ? "RM"
                            : defaultCurrencyCode}{" "}
                        {formatAmount(
                            amountsByCurrency?.[defaultCurrencyCode || "MYR"] ||
                                0,
                            defaultCurrencyCode || "MYR"
                        )}
                    </div>
                    {amountsByCurrency &&
                        Object.keys(amountsByCurrency).length > 1 && (
                            <div className="text-xs text-muted-foreground space-y-1">
                                {Object.entries(amountsByCurrency)
                                    .filter(
                                        ([code]) => code !== defaultCurrencyCode
                                    )
                                    .map(([code, amount]) => (
                                        <div
                                            key={code}
                                            className="flex justify-between"
                                        >
                                            <span>{code}:</span>
                                            <span>
                                                {formatAmount(amount, code)}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        )}
                </div>
            ),
            icon: <Wallet className="h-6 w-6 text-primary" />,
            url: route("club.payments.index"),
        },
        {
            label: "Attendance Rate",
            count: `${attendanceRate}%`,
            icon: <Calendar className="h-6 w-6 text-blue-600" />,
            url: route("club.attendances.index"),
        },
        {
            label: "Present Days",
            count: presentDays,
            icon: <Calendar className="h-6 w-6 text-green-600" />,
            url: route("club.attendances.index"),
        },
        {
            label: "Absent Days",
            count: absentDays,
            icon: <Calendar className="h-6 w-6 text-red-600" />,
            url: route("club.attendances.index"),
        },
        {
            label: "Certifications",
            count: certificationsCount,
            icon: <Award className="h-6 w-6 text-purple-600" />,
            url: route("club.certifications.index"),
        },
    ];

    const formatEventDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatEventTime = (timeStr?: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatPaymentProofTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPaymentAmount = (
        amount: number,
        currencyCode: string = "MYR",
        currencySymbol?: string
    ) => {
        const numAmount = Number(amount) || 0;
        const symbol =
            currencySymbol || (currencyCode === "MYR" ? "RM" : currencyCode);
        return `${symbol} ${numAmount.toFixed(2)}`;
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Payment Proofs Alert */}
                {paymentProofs && paymentProofs.length > 0 && (
                    <Card className="border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <CardTitle className="text-lg">
                                        Payment Proofs (Today)
                                    </CardTitle>
                                </div>
                                <Link
                                    href={route("club.payments.index")}
                                    className="text-sm text-primary hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-5">
                                {paymentProofs.map((proof) => (
                                    <Link
                                        key={proof.id}
                                        href={route("club.payments.index", {
                                            highlight: proof.payment_id,
                                        })}
                                        className="block"
                                    >
                                        <div className="p-3 rounded-lg border bg-white dark:bg-gray-800 hover:bg-accent/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h4 className="font-semibold text-sm line-clamp-1">
                                                    {proof.payment.student.name}
                                                    {proof.payment.student
                                                        .surname
                                                        ? ` ${proof.payment.student.surname}`
                                                        : ""}
                                                </h4>
                                                <FileText className="h-4 w-4 text-green-600 shrink-0" />
                                            </div>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Coins className="h-3 w-3" />
                                                    <span className="font-medium text-foreground">
                                                        {formatPaymentAmount(
                                                            proof.payment
                                                                .amount,
                                                            proof.payment
                                                                .currency_code,
                                                            proof.payment
                                                                .currency
                                                                ?.symbol
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {formatPaymentProofTime(
                                                            proof.created_at
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-3 w-3" />
                                                    <span className="line-clamp-1">
                                                        {
                                                            proof.original_filename
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                {/* Upcoming Events Alert */}
                {upcomingEvents && upcomingEvents.length > 0 && (
                    <Card className="border-orange-500 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                    <CardTitle className="text-lg">
                                        Upcoming Events
                                    </CardTitle>
                                </div>
                                <Link
                                    href={route("club.events.index")}
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
                                            "club.events.edit",
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
                                                        {formatEventDate(
                                                            event.event_date
                                                        )}
                                                    </span>
                                                </div>
                                                {event.start_time && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3 w-3" />
                                                        <span>
                                                            {formatEventTime(
                                                                event.start_time
                                                            )}
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

                {/* Main Stats */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                        Overview Statistics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {stats.map((item) => (
                            <Link
                                key={item.label}
                                href={item.url}
                                className={`block group ${
                                    item.label === "Total Amount"
                                        ? "col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                                        : ""
                                }`}
                            >
                                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                            {item.label}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            {item.icon}
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {item.count}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Rating Statistics */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                        Rating Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href={route("club.ratings.index")}
                            className="block group"
                        >
                            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                        Average Student Rating
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <RatingStars
                                            rating={Math.round(
                                                avgStudentRating
                                            )}
                                            readonly
                                            size="sm"
                                        />
                                        <span className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {avgStudentRating.toFixed(1)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link
                            href={route("club.ratings.index")}
                            className="block group"
                        >
                            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                        Average Instructor Rating
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <RatingStars
                                            rating={Math.round(
                                                avgInstructorRating
                                            )}
                                            readonly
                                            size="sm"
                                        />
                                        <span className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {avgInstructorRating.toFixed(1)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link
                            href={route("club.ratings.index")}
                            className="block group"
                        >
                            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                        Total Ratings
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                                        {totalRatings}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
