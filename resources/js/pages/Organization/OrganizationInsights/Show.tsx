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
    Building2,
    Users,
    Calendar,
    Coins,
    TrendingUp,
    UserCheck,
    Activity,
    Star,
    MapPin,
    Phone,
    Globe,
    Mail,
} from "lucide-react";

interface Organization {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    status: boolean;
    created_at: string;
    default_currency: {
        code: string;
    };
    currency_symbol: string;
}

interface OrganizationData {
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    status: string;
    currency: string;
    currency_symbol: string;
    established_date: string;
    years_active: number;
    total_clubs: number;
    total_students: number;
    total_instructors: number;
}

interface StudentData {
    summary: {
        total_students: number;
        new_students: number;
        active_students: number;
        inactive_students: number;
        retention_rate: number;
    };
    monthly_growth: Array<{
        month: string;
        count: number;
    }>;
    students_by_grade: Array<{
        grade: string;
        count: number;
    }>;
}

interface ClubData {
    summary: {
        total_clubs: number;
        active_clubs: number;
        inactive_clubs: number;
    };
    clubs_with_students: Array<{
        id: number;
        name: string;
        students_count: number;
        status: string;
        city: string;
        country: string;
    }>;
}

interface InstructorData {
    summary: {
        total_instructors: number;
        active_instructors: number;
        inactive_instructors: number;
    };
    instructors_with_students: Array<{
        id: number;
        name: string;
        students_count: number;
        status: string;
        club: string;
    }>;
}

interface AttendanceData {
    summary: {
        total_classes: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        overall_attendance_rate: number;
    };
    attendance_by_club: Array<{
        club_name: string;
        total_classes: number;
        present_classes: number;
        attendance_rate: number;
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
}

interface RecentActivity {
    type: string;
    description: string;
    date: string;
    status: string;
}

interface Props {
    organization: Organization;
    organizationData: OrganizationData;
    studentData: StudentData;
    clubData: ClubData;
    instructorData: InstructorData;
    attendanceData: AttendanceData;
    paymentData: PaymentData;
    recentActivity: RecentActivity[];
    filters: {
        year?: string;
        month?: string;
    };
}

export default function OrganizationInsights({
    organization,
    organizationData,
    studentData,
    clubData,
    instructorData,
    attendanceData,
    paymentData,
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
        router.get(route("organization.insights.show"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800";
            case "inactive":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Organization Insights" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                                    <Building2 className="h-8 w-8 text-blue-600" />
                                    <span>Organization Insights</span>
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {organizationData.name} - Established{" "}
                                    {organizationData.established_date}
                                </p>
                            </div>
                            <Badge
                                className={getStatusColor(
                                    organizationData.status
                                )}
                            >
                                {organizationData.status}
                            </Badge>
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
                                    <Users className="h-8 w-8 text-blue-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Students
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {organizationData.total_students}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Building2 className="h-8 w-8 text-green-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Clubs
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {organizationData.total_clubs}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <UserCheck className="h-8 w-8 text-purple-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Instructors
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {organizationData.total_instructors}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <TrendingUp className="h-8 w-8 text-orange-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Years Active
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {organizationData.years_active}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Organization Information */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Building2 className="h-5 w-5" />
                                <span>Organization Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            {organizationData.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            {organizationData.phone}
                                        </span>
                                    </div>
                                    {organizationData.website && (
                                        <div className="flex items-center space-x-3">
                                            <Globe className="h-4 w-4 text-gray-500" />
                                            <a
                                                href={organizationData.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {organizationData.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            {organizationData.address}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Coins className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            Currency:{" "}
                                            {organizationData.currency} (
                                            {organizationData.currency_symbol})
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            Established:{" "}
                                            {organizationData.established_date}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <TrendingUp className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            Active for:{" "}
                                            {organizationData.years_active}{" "}
                                            years
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs defaultValue="students" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="students">Students</TabsTrigger>
                            <TabsTrigger value="clubs">Clubs</TabsTrigger>
                            <TabsTrigger value="instructors">
                                Instructors
                            </TabsTrigger>
                            <TabsTrigger value="attendance">
                                Attendance
                            </TabsTrigger>
                            <TabsTrigger value="payments">Payments</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>

                        {/* Students Tab */}
                        <TabsContent value="students" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {
                                                    studentData.summary
                                                        .total_students
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total Students
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {
                                                    studentData.summary
                                                        .new_students
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                New This Period
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {
                                                    studentData.summary
                                                        .active_students
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Active Students
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {
                                                    studentData.summary
                                                        .retention_rate
                                                }
                                                %
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Retention Rate
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Students by Grade */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Students by Grade</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {studentData.students_by_grade.map(
                                            (grade) => (
                                                <div
                                                    key={grade.grade}
                                                    className="text-center p-4 border rounded-lg"
                                                >
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {grade.count}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {grade.grade}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Clubs Tab */}
                        <TabsContent value="clubs" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {clubData.summary.total_clubs}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total Clubs
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {clubData.summary.active_clubs}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Active Clubs
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">
                                                {
                                                    clubData.summary
                                                        .inactive_clubs
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Inactive Clubs
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Clubs List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Clubs Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {clubData.clubs_with_students.map(
                                            (club) => (
                                                <div
                                                    key={club.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {club.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {club.city},{" "}
                                                            {club.country}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-blue-600">
                                                            {
                                                                club.students_count
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Students
                                                        </div>
                                                        <Badge
                                                            className={getStatusColor(
                                                                club.status
                                                            )}
                                                        >
                                                            {club.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Instructors Tab */}
                        <TabsContent value="instructors" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {
                                                    instructorData.summary
                                                        .total_instructors
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total Instructors
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {
                                                    instructorData.summary
                                                        .active_instructors
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Active Instructors
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">
                                                {
                                                    instructorData.summary
                                                        .inactive_instructors
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Inactive Instructors
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructors List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Instructors Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {instructorData.instructors_with_students.map(
                                            (instructor) => (
                                                <div
                                                    key={instructor.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {instructor.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {instructor.club}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-blue-600">
                                                            {
                                                                instructor.students_count
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Students
                                                        </div>
                                                        <Badge
                                                            className={getStatusColor(
                                                                instructor.status
                                                            )}
                                                        >
                                                            {instructor.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

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
                                                        .overall_attendance_rate
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

                            {/* Attendance by Club */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Attendance by Club</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {attendanceData.attendance_by_club.map(
                                            (club, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {club.club_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {
                                                                club.present_classes
                                                            }{" "}
                                                            /{" "}
                                                            {club.total_classes}{" "}
                                                            classes
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-green-600">
                                                            {
                                                                club.attendance_rate
                                                            }
                                                            %
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Attendance Rate
                                                        </div>
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
                                                {
                                                    organizationData.currency_symbol
                                                }{" "}
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
                                                {
                                                    organizationData.currency_symbol
                                                }{" "}
                                                {paymentData.summary.pending_amount.toFixed(
                                                    2
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Pending
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {
                                                    organizationData.currency_symbol
                                                }{" "}
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
                                                        "student_registration" ? (
                                                            <Users className="h-5 w-5 text-blue-600" />
                                                        ) : (
                                                            <Coins className="h-5 w-5 text-green-600" />
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
