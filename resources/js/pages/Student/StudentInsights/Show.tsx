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
    User,
    Calendar,
    Coins,
    Award,
    Star,
    TrendingUp,
    Activity,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

interface Student {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    dob: string;
    grade: string;
    status: boolean;
    created_at: string;
    club: {
        name: string;
        logo?: string;
    };
    organization: {
        name: string;
        logo?: string;
    };
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
    };
    monthly_breakdown: Array<{
        month: string;
        total: number;
        present: number;
        rate: number;
    }>;
    day_patterns: Array<{
        day: string;
        total: number;
        present: number;
        rate: number;
    }>;
}

interface PaymentData {
    summary: {
        total_paid: number;
        pending_amount: number;
        total_amount: number;
        payment_rate: number;
    };
    monthly_breakdown: Array<{
        month: string;
        total: number;
        paid: number;
        pending: number;
    }>;
    methods: Array<{
        method: string;
        total: number;
    }>;
    recent_payments: Array<{
        id: number;
        amount: number;
        status: string;
        method: string;
        pay_at: string;
        formatted_amount: string;
    }>;
}

interface Certification {
    id: number;
    name: string;
    grade: string;
    earned_at: string;
    expires_at: string;
}

interface Rating {
    average_rating: number;
    total_ratings: number;
    rating_breakdown: Array<{
        rating: number;
        count: number;
    }>;
    recent_ratings: Array<{
        id: number;
        rating: number;
        comment: string;
        rater_name: string;
        created_at: string;
    }>;
}

interface PerformanceData {
    attendance_rate: number;
    payment_rate: number;
    club_avg_attendance: number;
    club_avg_payment: number;
    attendance_vs_club: number;
    payment_vs_club: number;
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
    certifications: Certification[];
    ratings: Rating;
    performanceData: PerformanceData;
    recentActivity: RecentActivity[];
    filters: {
        year?: string;
        month?: string;
    };
}

export default function StudentInsights({
    student,
    studentData,
    attendanceData,
    paymentData,
    certifications,
    ratings,
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
                delete params.month;
            } else {
                params.month = value;
            }
        }
        router.get(route("student.student-insights.show"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "present":
            case "paid":
            case "issued":
                return "bg-green-100 text-green-800";
            case "absent":
            case "unpaid":
                return "bg-red-100 text-red-800";
            case "late":
                return "bg-yellow-100 text-yellow-800";
            case "excused":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`My Insights - ${student.name} ${student.surname}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                                    <User className="h-8 w-8 text-blue-600" />
                                    <span>My Insights</span>
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>
                                        {student.name} {student.surname} -
                                    </span>
                                    {student.club?.logo ? (
                                        <img
                                            src={`/storage/${student.club.logo}`}
                                            alt={`${student.club.name} Logo`}
                                            className="w-4 h-4 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary">
                                                {student.club?.name?.charAt(
                                                    0
                                                ) || "C"}
                                            </span>
                                        </div>
                                    )}
                                    <span>{student.club?.name}</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Joined {studentData.join_date} (
                                    {studentData.duration})
                                </p>
                                {studentData.is_new_student && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800"
                                    >
                                        New Student
                                    </Badge>
                                )}
                                {studentData.is_senior_student && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800"
                                    >
                                        Senior Student
                                    </Badge>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Organization:</span>
                                    {student.organization?.logo ? (
                                        <img
                                            src={`/storage/${student.organization.logo}`}
                                            alt={`${student.organization.name} Logo`}
                                            className="w-4 h-4 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary">
                                                {student.organization?.name?.charAt(
                                                    0
                                                ) || "O"}
                                            </span>
                                        </div>
                                    )}
                                    <span>
                                        {student.organization?.name || "N/A"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Grade: {student.grade || "N/A"}
                                </p>
                                <Badge
                                    className={
                                        student.status
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }
                                >
                                    {student.status ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Year
                                    </label>
                                    <Select
                                        value={selectedYear}
                                        onValueChange={(value) =>
                                            handleFilterChange("year", value)
                                        }
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(
                                                { length: 5 },
                                                (_, i) => {
                                                    const year =
                                                        new Date().getFullYear() -
                                                        i;
                                                    return (
                                                        <SelectItem
                                                            key={year}
                                                            value={year.toString()}
                                                        >
                                                            {year}
                                                        </SelectItem>
                                                    );
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Month
                                    </label>
                                    <Select
                                        value={selectedMonth}
                                        onValueChange={(value) =>
                                            handleFilterChange("month", value)
                                        }
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All months
                                            </SelectItem>
                                            <SelectItem value="1">
                                                January
                                            </SelectItem>
                                            <SelectItem value="2">
                                                February
                                            </SelectItem>
                                            <SelectItem value="3">
                                                March
                                            </SelectItem>
                                            <SelectItem value="4">
                                                April
                                            </SelectItem>
                                            <SelectItem value="5">
                                                May
                                            </SelectItem>
                                            <SelectItem value="6">
                                                June
                                            </SelectItem>
                                            <SelectItem value="7">
                                                July
                                            </SelectItem>
                                            <SelectItem value="8">
                                                August
                                            </SelectItem>
                                            <SelectItem value="9">
                                                September
                                            </SelectItem>
                                            <SelectItem value="10">
                                                October
                                            </SelectItem>
                                            <SelectItem value="11">
                                                November
                                            </SelectItem>
                                            <SelectItem value="12">
                                                December
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Attendance Rate
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {
                                                attendanceData.summary
                                                    .attendance_rate
                                            }
                                            %
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {attendanceData.summary.present} of{" "}
                                            {
                                                attendanceData.summary
                                                    .total_classes
                                            }{" "}
                                            classes
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Coins className="h-8 w-8 text-blue-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Payment Rate
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {paymentData.summary.payment_rate}%
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            RM{" "}
                                            {paymentData.summary.total_paid.toFixed(
                                                2
                                            )}{" "}
                                            paid
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Award className="h-8 w-8 text-purple-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Certifications
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {certifications.length}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Total certifications issued
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Star className="h-8 w-8 text-yellow-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Average Rating
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {ratings.average_rating}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            From {ratings.total_ratings} ratings
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Student Join Information */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>My Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {studentData.join_year}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Join Year
                                    </div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {studentData.join_month}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Join Month
                                    </div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {studentData.duration_years}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Years as Student
                                    </div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {studentData.duration_months}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Total Months
                                    </div>
                                </div>
                            </div>

                            {studentData.age_at_join && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                            Age when joined:
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {studentData.age_at_join} years old
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-sm">
                                    Joined: {studentData.join_date}
                                </Badge>
                                <Badge variant="outline" className="text-sm">
                                    Duration: {studentData.duration}
                                </Badge>
                                {studentData.is_new_student && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800"
                                    >
                                        New Student (less than 3 months)
                                    </Badge>
                                )}
                                {studentData.is_senior_student && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800"
                                    >
                                        Senior Student (5+ years)
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs defaultValue="attendance" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="attendance">
                                Attendance
                            </TabsTrigger>
                            <TabsTrigger value="payments">Payments</TabsTrigger>
                            <TabsTrigger value="certifications">
                                Certifications
                            </TabsTrigger>
                            <TabsTrigger value="ratings">Ratings</TabsTrigger>
                            <TabsTrigger value="performance">
                                Performance
                            </TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>

                        {/* Attendance Tab */}
                        <TabsContent value="attendance" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {
                                                    attendanceData.summary
                                                        .total_classes
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total Classes
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {attendanceData.summary.present}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Present
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">
                                                {attendanceData.summary.absent}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Absent
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {attendanceData.summary.late}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Late
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {
                                                    attendanceData.summary
                                                        .attendance_rate
                                                }
                                                %
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Attendance Rate
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Monthly Breakdown */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Monthly Attendance Breakdown
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        {attendanceData.monthly_breakdown.map(
                                            (month) => (
                                                <div
                                                    key={month.month}
                                                    className="text-center p-4 border rounded-lg"
                                                >
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {month.rate}%
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {month.month}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {month.present}/
                                                        {month.total}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Payments Tab */}
                        <TabsContent value="payments" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                RM{" "}
                                                {paymentData.summary.total_paid.toFixed(
                                                    2
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total Paid
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                RM{" "}
                                                {paymentData.summary.pending_amount.toFixed(
                                                    2
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Unpaid
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                RM{" "}
                                                {paymentData.summary.total_amount.toFixed(
                                                    2
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total Amount
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {
                                                    paymentData.summary
                                                        .payment_rate
                                                }
                                                %
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Payment Rate
                                            </div>
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
                                    <div className="space-y-4">
                                        {paymentData.recent_payments.map(
                                            (payment) => (
                                                <div
                                                    key={payment.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div>
                                                        <p className="font-semibold">
                                                            {
                                                                payment.formatted_amount
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {payment.method} •{" "}
                                                            {new Date(
                                                                payment.pay_at
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={getStatusColor(
                                                            payment.status
                                                        )}
                                                    >
                                                        {payment.status}
                                                    </Badge>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Certifications Tab */}
                        <TabsContent
                            value="certifications"
                            className="space-y-6"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Certifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {certifications.length > 0 ? (
                                            certifications.map(
                                                (certification) => (
                                                    <div
                                                        key={certification.id}
                                                        className="flex items-center justify-between p-4 border rounded-lg"
                                                    >
                                                        <div>
                                                            <h3 className="font-semibold">
                                                                {
                                                                    certification.name
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Grade:{" "}
                                                                {
                                                                    certification.grade
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Issued:{" "}
                                                                {new Date(
                                                                    certification.earned_at
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <Badge className="bg-green-100 text-green-800">
                                                            Issued
                                                        </Badge>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                No certifications issued yet
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Ratings Tab */}
                        <TabsContent value="ratings" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-600">
                                                {ratings.average_rating}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Average Rating
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                From {ratings.total_ratings}{" "}
                                                ratings
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="space-y-2">
                                            {ratings.rating_breakdown.map(
                                                (rating) => (
                                                    <div
                                                        key={rating.rating}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-sm">
                                                            {rating.rating}{" "}
                                                            stars
                                                        </span>
                                                        <span className="text-sm font-semibold">
                                                            {rating.count}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Ratings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Ratings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {ratings.recent_ratings.length > 0 ? (
                                            ratings.recent_ratings.map(
                                                (rating) => (
                                                    <div
                                                        key={rating.id}
                                                        className="p-4 border rounded-lg"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-lg font-semibold">
                                                                    {
                                                                        rating.rating
                                                                    }
                                                                </span>
                                                                <Star className="h-4 w-4 text-yellow-500" />
                                                                <span className="text-sm text-gray-600">
                                                                    by{" "}
                                                                    {
                                                                        rating.rater_name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(
                                                                    rating.created_at
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {rating.comment && (
                                                            <p className="text-sm text-gray-700">
                                                                {rating.comment}
                                                            </p>
                                                        )}
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                No ratings received yet
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Performance Tab */}
                        <TabsContent value="performance" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Attendance Performance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    My Attendance Rate
                                                </span>
                                                <span className="font-semibold">
                                                    {
                                                        performanceData.attendance_rate
                                                    }
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Club Average
                                                </span>
                                                <span className="font-semibold">
                                                    {
                                                        performanceData.club_avg_attendance
                                                    }
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Difference
                                                </span>
                                                <span
                                                    className={`font-semibold ${
                                                        performanceData.attendance_vs_club >=
                                                        0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {performanceData.attendance_vs_club >=
                                                    0
                                                        ? "+"
                                                        : ""}
                                                    {performanceData.attendance_vs_club.toFixed(
                                                        1
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Payment Performance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    My Payment Rate
                                                </span>
                                                <span className="font-semibold">
                                                    {
                                                        performanceData.payment_rate
                                                    }
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Club Average
                                                </span>
                                                <span className="font-semibold">
                                                    {
                                                        performanceData.club_avg_payment
                                                    }
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Difference
                                                </span>
                                                <span
                                                    className={`font-semibold ${
                                                        performanceData.payment_vs_club >=
                                                        0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {performanceData.payment_vs_club >=
                                                    0
                                                        ? "+"
                                                        : ""}
                                                    {performanceData.payment_vs_club.toFixed(
                                                        1
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Activity Tab */}
                        <TabsContent value="activity" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Activity className="h-5 w-5" />
                                        <span>Recent Activity</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map(
                                            (activity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-4 p-4 border rounded-lg"
                                                >
                                                    <div className="flex-shrink-0">
                                                        {activity.type ===
                                                        "attendance" ? (
                                                            <Calendar className="h-5 w-5 text-blue-600" />
                                                        ) : activity.type ===
                                                          "payment" ? (
                                                            <Coins className="h-5 w-5 text-green-600" />
                                                        ) : (
                                                            <Award className="h-5 w-5 text-purple-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {
                                                                activity.description
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(
                                                                activity.date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={getStatusColor(
                                                            activity.status
                                                        )}
                                                    >
                                                        {activity.status}
                                                    </Badge>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
