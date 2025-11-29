import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GraduationCap,
    Landmark,
    Users,
    Star,
    Calendar,
    Award,
    ArrowRight,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Wallet,
    Clock,
    Hourglass,
} from "lucide-react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link } from "@inertiajs/react";
import RatingStars from "@/components/RatingStars";
import { Badge } from "@/components/ui/badge";

interface StudentWithUnpaidFees {
    id: number;
    name: string;
    surname?: string;
    club?: {
        id: number;
        name: string;
    };
    feePlan?: {
        plan?: {
            name: string;
            base_amount: number;
            currency_code: string;
        };
    };
}

export default function DashboardCards({
    studentsCount,
    clubsCount,
    instructorsCount,
    avgStudentRating,
    avgInstructorRating,
    totalRatings,
    totalAttendanceDays,
    presentDays,
    absentDays,
    attendanceRate,
    certificationsCount,
    totalPayments,
    paidPayments,
    unpaidPayments,
    totalRevenue,
    defaultCurrency,
    studentsWithUnpaidFees = [],
}: {
    studentsCount: number;
    clubsCount: number;
    instructorsCount: number;
    avgStudentRating: number;
    avgInstructorRating: number;
    totalRatings: number;
    totalAttendanceDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
    certificationsCount: number;
    totalPayments: number;
    paidPayments: number;
    unpaidPayments: number;
    totalRevenue: number;
    defaultCurrency: string;
    studentsWithUnpaidFees?: StudentWithUnpaidFees[];
}) {
    const stats = [
        // Basic Organization Stats
        {
            label: "Students",
            count: studentsCount,
            icon: <GraduationCap className="h-6 w-6 text-primary" />,
            url: route("organization.students.index"),
        },
        {
            label: "Clubs",
            count: clubsCount,
            icon: <Landmark className="h-6 w-6 text-blue-600" />,
            url: route("organization.clubs.index"),
        },
        {
            label: "Instructors",
            count: instructorsCount,
            icon: <Users className="h-6 w-6 text-green-600" />,
            url: route("organization.instructors.index"),
        },
        // Payment Stats
        {
            label: "Total Payments",
            count: totalPayments,
            icon: <Wallet className="h-6 w-6 text-blue-600" />,
            url: route("organization.payments.index"),
        },
        {
            label: "Paid",
            count: paidPayments,
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            url: route("organization.payments.index"),
        },
        {
            label: "Unpaid",
            count: unpaidPayments,
            icon: <AlertCircle className="h-6 w-6 text-red-600" />,
            url: route("organization.payments.index"),
        },
        {
            label: "Total Revenue",
            count: `${defaultCurrency === "MYR" ? "RM" : defaultCurrency} ${totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
            icon: <Wallet className="h-6 w-6 text-emerald-600" />,
            url: route("organization.payments.index"),
        },
        // Attendance Stats
        {
            label: "Attendance Rate",
            count: `${attendanceRate}%`,
            icon: <Calendar className="h-6 w-6 text-blue-600" />,
            url: route("organization.attendances.index"),
        },
        {
            label: "Present Days",
            count: presentDays,
            icon: <Calendar className="h-6 w-6 text-green-600" />,
            url: route("organization.attendances.index"),
        },
        {
            label: "Absent Days",
            count: absentDays,
            icon: <Calendar className="h-6 w-6 text-red-600" />,
            url: route("organization.attendances.index"),
        },
        // Other Stats
        {
            label: "Certifications",
            count: certificationsCount,
            icon: <Award className="h-6 w-6 text-purple-600" />,
            url: route("organization.certifications.index"),
        },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Students with Unpaid Fees Alert */}
                {studentsWithUnpaidFees && studentsWithUnpaidFees.length > 0 && (
                    <Card className="border-red-500 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Hourglass className="h-5 w-5 text-red-600" />
                                    <CardTitle className="text-lg">
                                        Students with Unpaid Fees
                                    </CardTitle>
                                </div>
                                <Link
                                    href={route("organization.payments.index", {
                                        status: "unpaid",
                                    })}
                                    className="text-sm text-primary hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-5">
                                {studentsWithUnpaidFees.map((student) => (
                                    <Link
                                        key={student.id}
                                        href={route(
                                            "organization.payments.index",
                                            {
                                                student_id: student.id,
                                            }
                                        )}
                                        className="block"
                                    >
                                        <div className="p-3 rounded-lg border bg-white dark:bg-gray-800 hover:bg-accent/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h4 className="font-semibold text-sm line-clamp-1">
                                                    {student.name}
                                                    {student.surname
                                                        ? ` ${student.surname}`
                                                        : ""}
                                                </h4>
                                                <Hourglass className="h-4 w-4 text-red-600 shrink-0" />
                                            </div>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                {student.club && (
                                                    <div className="flex items-center gap-2">
                                                        <Landmark className="h-3 w-3" />
                                                        <span className="line-clamp-1">
                                                            {student.club.name}
                                                        </span>
                                                    </div>
                                                )}
                                                {student.feePlan?.plan && (
                                                    <div className="flex items-center gap-2">
                                                        <Wallet className="h-3 w-3" />
                                                        <span className="font-medium text-foreground">
                                                            {
                                                                student.feePlan
                                                                    .plan.currency_code
                                                            }{" "}
                                                            {Number(
                                                                student.feePlan
                                                                    .plan
                                                                    .base_amount
                                                            ).toFixed(2)}
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
                            href={route("organization.ratings.index")}
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
                            href={route("organization.ratings.index")}
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
                            href={route("organization.ratings.index")}
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
