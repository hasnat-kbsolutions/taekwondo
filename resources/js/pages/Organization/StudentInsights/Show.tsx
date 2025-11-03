import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    User,
    Calendar,
    Coins,
    Award,
    Star,
    TrendingUp,
    TrendingDown,
    Minus,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    Activity,
    BarChart3,
    PieChart,
    Edit,
    Wallet,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface Student {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    dob: string;
    grade: string;
    gender: string;
    nationality: string;
    profile_image?: string;
    status: boolean;
    organization: {
        id: number;
        name: string;
        logo?: string;
    };
    club: {
        id: number;
        name: string;
        logo?: string;
    };
    instructors: Array<{
        id: number;
        name: string;
    }>;
}

interface StudentData {
    join_date: string;
    join_year: number;
    join_month: string;
    join_day: number;
    duration: string;
    duration_years: number;
    duration_months: number;
    age_at_join?: number;
    is_new_student: boolean;
    is_senior_student: boolean;
}

interface AttendanceData {
    summary: {
        total_classes: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendance_rate: number;
        current_streak: number;
        longest_streak: number;
    };
    monthly_breakdown: Array<{
        month: string;
        total: number;
        present: number;
        rate: number;
        absent: number;
        late: number;
        excused: number;
    }>;
    day_pattern: Array<{
        day: string;
        total: number;
        present: number;
        rate: number;
    }>;
    recent_attendances: Array<{
        date: string;
        status: string;
        remarks?: string;
    }>;
}

interface PaymentData {
    summary: {
        total_paid: number;
        pending_amount: number;
        total_amount: number;
        payment_rate: number;
        total_payments: number;
    };
    monthly_breakdown: Array<{
        month: string;
        total: number;
        paid: number;
        pending: number;
        count: number;
    }>;
    methods: Array<{
        method: string;
        count: number;
        total: number;
    }>;
    recent_payments: Array<{
        id: number;
        amount: number;
        currency: string;
        status: string;
        method: string;
        payment_month: string;
        pay_at: string;
        notes?: string;
    }>;
}

interface CertificationData {
    total: number;
    recent: Array<{
        id: number;
        file: string;
        issued_at: string;
        notes?: string;
    }>;
}

interface RatingData {
    received: {
        average: number;
        total: number;
        breakdown: Array<{
            rating: number;
            count: number;
        }>;
        recent: Array<{
            id: number;
            rating: number;
            comment?: string;
            rater: string;
            created_at: string;
        }>;
    };
    given: {
        total: number;
        recent: Array<{
            id: number;
            rating: number;
            comment?: string;
            rated: string;
            created_at: string;
        }>;
    };
}

interface PerformanceData {
    attendance_trend: Array<{
        date: string;
        total: number;
        present: number;
        rate: number;
    }>;
    club_comparison: {
        student_rate: number;
        club_average: number;
        performance: string;
    };
}

interface RecentActivity {
    type: string;
    description: string;
    date: string;
    status: string;
}

interface Props {
    student: Student;
    studentData: StudentData;
    attendanceData: AttendanceData;
    paymentData: PaymentData;
    certificationData: CertificationData;
    ratingData: RatingData;
    performanceData: PerformanceData;
    recentActivity: RecentActivity[];
    filters: {
        year?: string;
        month?: string;
        date_range?: string;
    };
}

export default function StudentInsights({
    student,
    studentData,
    attendanceData,
    paymentData,
    certificationData,
    ratingData,
    performanceData,
    recentActivity,
    filters,
}: Props) {
    const [selectedYear, setSelectedYear] = useState(
        filters.year || new Date().getFullYear().toString()
    );
    const [selectedMonth, setSelectedMonth] = useState(filters.month || "all");

    const handleFilterChange = (type: string, value: string) => {
        const params: any = { year: selectedYear };

        if (type === "year") {
            setSelectedYear(value);
            params.year = value;
            params.month = "all";
        } else if (type === "month") {
            setSelectedMonth(value);
            if (value === "all") {
                // Don't include month parameter when "all" is selected
                delete params.month;
            } else {
                params.month = value;
            }
        }

        router.get(
            route("organization.student-insights.show", student.id),
            params,
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "present":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "absent":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "late":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "excused":
                return <AlertCircle className="h-4 w-4 text-blue-500" />;
            default:
                return <Minus className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            present: "bg-green-100 text-green-800",
            absent: "bg-red-100 text-red-800",
            late: "bg-yellow-100 text-yellow-800",
            excused: "bg-blue-100 text-blue-800",
            paid: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            issued: "bg-blue-100 text-blue-800",
        };

        return (
            <Badge
                className={
                    variants[status.toLowerCase() as keyof typeof variants] ||
                    "bg-muted text-muted-foreground"
                }
            >
                {status}
            </Badge>
        );
    };

    const getPerformanceIcon = (performance: string) => {
        switch (performance) {
            case "above":
                return <TrendingUp className="h-4 w-4 text-green-500" />;
            case "below":
                return <TrendingDown className="h-4 w-4 text-red-500" />;
            default:
                return <Minus className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return (
        <AuthenticatedLayout
            header={`Student Insights - ${student.name} ${student.surname}`}
        >
            <Head title={`Student Insights - ${student.name}`} />

            <div className="py-6 space-y-6">
                {/* Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-center space-x-6">
                                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                                    {student.profile_image ? (
                                        <img
                                            src={`/storage/${student.profile_image}`}
                                            alt={student.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-10 w-10 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-foreground mb-2">
                                        {student.name} {student.surname}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <span className="text-lg text-muted-foreground font-medium">
                                            {student.grade}
                                        </span>
                                        <span className="text-muted-foreground">
                                            •
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {student.club?.logo ? (
                                                <img
                                                    src={`/storage/${student.club.logo}`}
                                                    alt={`${student.club.name} Logo`}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">
                                                        {student.club?.name?.charAt(
                                                            0
                                                        ) || "C"}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-lg text-muted-foreground">
                                                {student.club?.name ||
                                                    "No Club"}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground">
                                            •
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {student.organization?.logo ? (
                                                <img
                                                    src={`/storage/${student.organization.logo}`}
                                                    alt={`${student.organization.name} Logo`}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">
                                                        {student.organization?.name?.charAt(
                                                            0
                                                        ) || "O"}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-lg text-muted-foreground">
                                                {student.organization?.name ||
                                                    "No Organization"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Joined {studentData.join_date} (
                                        {studentData.duration})
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant={
                                                student.status
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                student.status
                                                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                                    : "bg-red-500/10 text-red-700 dark:text-red-400"
                                            }
                                        >
                                            {student.status
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                        >
                                            {student.gender}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                        >
                                            {student.nationality}
                                        </Badge>
                                        {studentData.is_new_student && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-500/10 text-green-700 dark:text-green-400"
                                            >
                                                New Student
                                            </Badge>
                                        )}
                                        {studentData.is_senior_student && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                            >
                                                Senior Student
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={route("organization.students.index")}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Back to Students
                                    </Button>
                                </Link>
                                <Link
                                    href={route(
                                        "organization.students.edit",
                                        student.id
                                    )}
                                >
                                    <Button
                                        variant="default"
                                        className="w-full sm:w-auto"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Student
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <span>Data Filters</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Year
                                </label>
                                <Select
                                    value={selectedYear}
                                    onValueChange={(value) =>
                                        handleFilterChange("year", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from(
                                            { length: 5 },
                                            (_, i) =>
                                                new Date().getFullYear() - i
                                        ).map((year) => (
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

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Month
                                </label>
                                <Select
                                    value={selectedMonth}
                                    onValueChange={(value) =>
                                        handleFilterChange("month", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All months" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All months
                                        </SelectItem>
                                        {months.map((month, index) => (
                                            <SelectItem
                                                key={month}
                                                value={(index + 1)
                                                    .toString()
                                                    .padStart(2, "0")}
                                            >
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-blue-500/5 border-blue-200 dark:border-blue-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                Attendance Rate
                            </CardTitle>
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                {attendanceData.summary.attendance_rate}%
                            </div>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                {attendanceData.summary.present} of{" "}
                                {attendanceData.summary.total_classes} classes
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-500/5 border-green-200 dark:border-green-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                                Payment Rate
                            </CardTitle>
                            <Coins className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                                {paymentData.summary.payment_rate}%
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                RM {paymentData.summary.total_paid.toFixed(2)}{" "}
                                paid
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-500/5 border-purple-200 dark:border-purple-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
                                Certifications
                            </CardTitle>
                            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                {certificationData.total}
                            </div>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                Total certifications earned
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-yellow-500/5 border-yellow-200 dark:border-yellow-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                                Average Rating
                            </CardTitle>
                            <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                                {ratingData.received.average}
                            </div>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                From {ratingData.received.total} ratings
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Student Join Information */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                            <User className="h-5 w-5 text-primary" />
                            <span>Student Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center p-6 bg-blue-500/5 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {studentData.join_year}
                                </div>
                                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    Join Year
                                </div>
                            </div>
                            <div className="text-center p-6 bg-green-500/5 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    {studentData.join_month}
                                </div>
                                <div className="text-sm font-medium text-green-700 dark:text-green-300">
                                    Join Month
                                </div>
                            </div>
                            <div className="text-center p-6 bg-purple-500/5 rounded-lg border border-purple-200 dark:border-purple-800">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                    {studentData.duration_years}
                                </div>
                                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                    Years as Student
                                </div>
                            </div>
                            <div className="text-center p-6 bg-orange-500/5 rounded-lg border border-orange-200 dark:border-orange-800">
                                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                                    {studentData.duration_months}
                                </div>
                                <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
                                    Total Months
                                </div>
                            </div>
                        </div>

                        {studentData.age_at_join && (
                            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Age when joined:
                                    </span>
                                    <span className="text-lg font-bold text-foreground">
                                        {studentData.age_at_join} years old
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Badge variant="outline" className="text-sm">
                                Joined: {studentData.join_date}
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                Duration: {studentData.duration}
                            </Badge>
                            {studentData.is_new_student && (
                                <Badge
                                    variant="secondary"
                                    className="bg-green-500/10 text-green-700 dark:text-green-400"
                                >
                                    New Student (less than 3 months)
                                </Badge>
                            )}
                            {studentData.is_senior_student && (
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                >
                                    Senior Student (5+ years)
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Tabs */}
                <Tabs defaultValue="attendance" className="space-y-6">
                    <Card className="p-1">
                        <TabsList className="grid w-full grid-cols-6 bg-transparent">
                            <TabsTrigger
                                value="attendance"
                                className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400"
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                Attendance
                            </TabsTrigger>
                            <TabsTrigger
                                value="payments"
                                className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400"
                            >
                                <Coins className="h-4 w-4 mr-2" />
                                Payments
                            </TabsTrigger>
                            <TabsTrigger
                                value="certifications"
                                className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                            >
                                <Award className="h-4 w-4 mr-2" />
                                Certifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="ratings"
                                className="data-[state=active]:bg-yellow-500/10 data-[state=active]:text-yellow-700 dark:data-[state=active]:text-yellow-400"
                            >
                                <Star className="h-4 w-4 mr-2" />
                                Ratings
                            </TabsTrigger>
                            <TabsTrigger
                                value="performance"
                                className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-400"
                            >
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Performance
                            </TabsTrigger>
                            <TabsTrigger
                                value="activity"
                                className="data-[state=active]:bg-muted data-[state=active]:text-foreground"
                            >
                                <Activity className="h-4 w-4 mr-2" />
                                Activity
                            </TabsTrigger>
                        </TabsList>
                    </Card>

                    {/* Attendance Tab */}
                    <TabsContent value="attendance" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Attendance Summary */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center space-x-2 text-lg">
                                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span>Attendance Summary</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-200 dark:border-green-800">
                                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                                                {attendanceData.summary.present}
                                            </div>
                                            <div className="text-sm font-medium text-green-700 dark:text-green-300">
                                                Present
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-red-500/5 rounded-lg border border-red-200 dark:border-red-800">
                                            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                                                {attendanceData.summary.absent}
                                            </div>
                                            <div className="text-sm font-medium text-red-700 dark:text-red-300">
                                                Absent
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-500/5 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                                                {attendanceData.summary.late}
                                            </div>
                                            <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                                                Late
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-blue-500/5 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                                {attendanceData.summary.excused}
                                            </div>
                                            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                Excused
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Current Streak
                                            </span>
                                            <span className="font-bold text-lg text-foreground">
                                                {
                                                    attendanceData.summary
                                                        .current_streak
                                                }{" "}
                                                days
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Longest Streak
                                            </span>
                                            <span className="font-bold text-lg text-foreground">
                                                {
                                                    attendanceData.summary
                                                        .longest_streak
                                                }{" "}
                                                days
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Monthly Breakdown */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center space-x-2 text-lg">
                                        <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <span>Monthly Breakdown</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {attendanceData.monthly_breakdown.map(
                                            (month) => (
                                                <div
                                                    key={month.month}
                                                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border"
                                                >
                                                    <span className="text-sm font-medium text-foreground">
                                                        {month.month}
                                                    </span>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="text-sm text-muted-foreground">
                                                            {month.present}/
                                                            {month.total}
                                                        </div>
                                                        <Badge variant="outline">
                                                            {month.rate}%
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Attendances */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center space-x-2 text-lg">
                                    <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    <span>Recent Attendances</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="font-semibold text-foreground">
                                                    Date
                                                </TableHead>
                                                <TableHead className="font-semibold text-foreground">
                                                    Status
                                                </TableHead>
                                                <TableHead className="font-semibold text-foreground">
                                                    Remarks
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {attendanceData.recent_attendances.map(
                                                (attendance) => (
                                                    <TableRow
                                                        key={attendance.date}
                                                        className="hover:bg-muted/50"
                                                    >
                                                        <TableCell className="font-medium">
                                                            {format(
                                                                parseISO(
                                                                    attendance.date
                                                                ),
                                                                "MMM dd, yyyy"
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                {getStatusIcon(
                                                                    attendance.status
                                                                )}
                                                                <span className="capitalize font-medium">
                                                                    {
                                                                        attendance.status
                                                                    }
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {attendance.remarks ||
                                                                "-"}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payments Tab */}
                    <TabsContent value="payments" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Payment Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                RM{" "}
                                                {paymentData.summary.total_paid.toFixed(
                                                    2
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Total Paid
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                RM{" "}
                                                {paymentData.summary.pending_amount.toFixed(
                                                    2
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Unpaid
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">
                                                Total Payments
                                            </span>
                                            <span className="font-bold">
                                                {
                                                    paymentData.summary
                                                        .total_payments
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">
                                                Payment Rate
                                            </span>
                                            <span className="font-bold">
                                                {
                                                    paymentData.summary
                                                        .payment_rate
                                                }
                                                %
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Methods */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Methods</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {paymentData.methods.map((method) => (
                                            <div
                                                key={method.method}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-sm">
                                                    {method.method}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-sm">
                                                        {method.count} payments
                                                    </div>
                                                    <Badge variant="outline">
                                                        RM{" "}
                                                        {method.total.toFixed(
                                                            2
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Payments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Payments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Month</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paymentData.recent_payments.map(
                                            (payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell>
                                                        {format(
                                                            parseISO(
                                                                payment.pay_at
                                                            ),
                                                            "MMM dd, yyyy"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {payment.currency}{" "}
                                                        {payment.amount.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="capitalize">
                                                        {payment.method}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            payment.status
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {payment.payment_month}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Certifications Tab */}
                    <TabsContent value="certifications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Certifications ({certificationData.total})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Issued Date</TableHead>
                                            <TableHead>File</TableHead>
                                            <TableHead>Notes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {certificationData.recent.map(
                                            (certification) => (
                                                <TableRow
                                                    key={certification.id}
                                                >
                                                    <TableCell>
                                                        {format(
                                                            parseISO(
                                                                certification.issued_at
                                                            ),
                                                            "MMM dd, yyyy"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                        >
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            View File
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {certification.notes ||
                                                            "-"}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Ratings Tab */}
                    <TabsContent value="ratings" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Ratings Received */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ratings Received</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">
                                            {ratingData.received.average}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Average from{" "}
                                            {ratingData.received.total} ratings
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {ratingData.received.breakdown.map(
                                            (breakdown) => (
                                                <div
                                                    key={breakdown.rating}
                                                    className="flex justify-between items-center"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                        <span className="text-sm">
                                                            {breakdown.rating}{" "}
                                                            stars
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {breakdown.count}
                                                    </Badge>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Ratings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Ratings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {ratingData.received.recent.map(
                                            (rating) => (
                                                <div
                                                    key={rating.id}
                                                    className="border-b pb-2 last:border-b-0"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium">
                                                                    {
                                                                        rating.rater
                                                                    }
                                                                </span>
                                                                <div className="flex">
                                                                    {Array.from(
                                                                        {
                                                                            length: 5,
                                                                        },
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <Star
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className={`h-3 w-3 ${
                                                                                    i <
                                                                                    rating.rating
                                                                                        ? "text-yellow-500 fill-current"
                                                                                        : "text-muted-foreground"
                                                                                }`}
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {rating.comment && (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {
                                                                        rating.comment
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {format(
                                                                parseISO(
                                                                    rating.created_at
                                                                ),
                                                                "MMM dd"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold">
                                            {
                                                performanceData.club_comparison
                                                    .student_rate
                                            }
                                            %
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Your Attendance Rate
                                        </div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold">
                                            {
                                                performanceData.club_comparison
                                                    .club_average
                                            }
                                            %
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Club Average
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-sm font-medium">
                                        Performance:
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        {getPerformanceIcon(
                                            performanceData.club_comparison
                                                .performance
                                        )}
                                        <span className="capitalize font-medium">
                                            {
                                                performanceData.club_comparison
                                                    .performance
                                            }{" "}
                                            average
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Recent Activity Tab */}
                    <TabsContent value="activity" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5" />
                                    <span>Recent Activity</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentActivity.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3 p-3 border rounded-lg"
                                        >
                                            <div className="flex-shrink-0">
                                                {activity.type ===
                                                    "attendance" && (
                                                    <Calendar className="h-4 w-4 text-blue-500" />
                                                )}
                                                {activity.type ===
                                                    "payment" && (
                                                    <Wallet className="h-4 w-4 text-green-500" />
                                                )}
                                                {activity.type ===
                                                    "certification" && (
                                                    <Award className="h-4 w-4 text-yellow-500" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(
                                                        parseISO(activity.date),
                                                        "MMM dd, yyyy 'at' HH:mm"
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                {getStatusBadge(
                                                    activity.status
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
