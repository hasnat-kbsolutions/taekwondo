import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GraduationCap,
    Building,
    Users,
    Group,
    Star,
    DollarSign,
    BadgeCheck,
    Hourglass,
    Calendar,
    Award,
    ArrowRight,
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link } from "@inertiajs/react";
import RatingStars from "@/components/RatingStars";

export default function DashboardCards({
    studentsCount,
    organizationsCount,
    clubsCount,
    SupportersCount,
    instructorsCount,
    paymentsCount,
    paidCount,
    pendingCount,
    totalAmount,
    amountsByCurrency,
    defaultCurrencyCode,
    totalAttendanceDays,
    presentDays,
    absentDays,
    attendanceRate,
    certificationsCount,
    avgStudentRating,
    avgInstructorRating,
    totalRatings,
}: {
    studentsCount: number;
    organizationsCount: number;
    clubsCount: number;
    SupportersCount: number;
    instructorsCount: number;
    paymentsCount: number;
    paidCount: number;
    pendingCount: number;
    totalAmount: number;
    amountsByCurrency: Record<string, number>;
    defaultCurrencyCode: string;
    totalAttendanceDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
    certificationsCount: number;
    avgStudentRating: number;
    avgInstructorRating: number;
    totalRatings: number;
}) {
    // Utility function to safely format amounts
    const formatAmount = (amount: any) => {
        return (Number(amount) || 0).toFixed(2);
    };
    const stats = [
        {
            label: "Total Amount",
            count: (
                <div className="space-y-1 w-full">
                    <div className="text-lg font-bold">
                        {defaultCurrencyCode === "MYR"
                            ? "RM"
                            : defaultCurrencyCode}{" "}
                        {formatAmount(amountsByCurrency[defaultCurrencyCode])}
                    </div>
                    {Object.keys(amountsByCurrency).length > 1 && (
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
                                        <span>{formatAmount(amount)}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ),
            icon: <DollarSign className="h-6 w-6 text-primary" />,
            url: route("admin.payments.index"),
        },
        {
            label: "Total Payments",
            count: paymentsCount,
            icon: <DollarSign className="h-6 w-6 text-primary w-100" />,
            url: route("admin.payments.index"),
        },

        {
            label: "Paid",
            count: paidCount,
            icon: <BadgeCheck className="h-6 w-6 text-green-600" />,
            url: route("admin.payments.index"),
        },
        {
            label: "Pending",
            count: pendingCount,
            icon: <Hourglass className="h-6 w-6 text-yellow-500" />,
            url: route("admin.payments.index"),
        },
        {
            label: "Students",
            count: studentsCount,
            icon: <GraduationCap className="h-6 w-6 text-primary" />,
            url: route("admin.students.index"),
        },
        {
            label: "Organizations",
            count: organizationsCount,
            icon: <Users className="h-6 w-6 text-blue-600" />,
            url: route("admin.organizations.index"),
        },
        {
            label: "Clubs",
            count: clubsCount,
            icon: <Building className="h-6 w-6 text-green-600" />,
            url: route("admin.clubs.index"),
        },
        {
            label: "Instructors",
            count: instructorsCount,
            icon: <Users className="h-6 w-6 text-purple-600" />,
            url: route("admin.instructors.index"),
        },
        {
            label: "Supporters",
            count: SupportersCount,
            icon: <Group className="h-6 w-6 text-orange-600" />,
            url: route("admin.supporters.index"),
        },

        {
            label: "Attendance Rate",
            count: `${attendanceRate}%`,
            icon: <Calendar className="h-6 w-6 text-blue-600" />,
            url: route("admin.attendances.index"),
        },
        {
            label: "Present Days",
            count: presentDays,
            icon: <Calendar className="h-6 w-6 text-green-600" />,
            url: route("admin.attendances.index"),
        },
        {
            label: "Absent Days",
            count: absentDays,
            icon: <Calendar className="h-6 w-6 text-red-600" />,
            url: route("admin.attendances.index"),
        },
        {
            label: "Certifications",
            count: certificationsCount,
            icon: <Award className="h-6 w-6 text-purple-600" />,
            url: route("admin.certifications.index"),
        },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="space-y-6">
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
                            href={route("admin.ratings.index")}
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
                            href={route("admin.ratings.index")}
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
                            href={route("admin.ratings.index")}
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
