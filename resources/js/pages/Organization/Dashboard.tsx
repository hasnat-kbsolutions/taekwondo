import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GraduationCap,
    Landmark,
    Users,
    Group,
    DollarSign,
    BadgeCheck,
    Hourglass,
    Star,
} from "lucide-react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import RatingStars from "@/components/RatingStars";

export default function DashboardCards({
    studentsCount,
    clubsCount,
    instructorsCount,
    paymentsCount,
    paidCount,
    pendingCount,
    totalAmount,
    avgStudentRating,
    avgInstructorRating,
    totalRatings,
}: {
    studentsCount: number;
    clubsCount: number;
    instructorsCount: number;
    paymentsCount: number;
    paidCount: number;
    pendingCount: number;
    totalAmount: number;
    avgStudentRating: number;
    avgInstructorRating: number;
    totalRatings: number;
}) {
    const stats = [
        { label: "Students", count: studentsCount, icon: <GraduationCap /> },
        { label: "Clubs", count: clubsCount, icon: <Landmark /> },
        { label: "Instructors", count: instructorsCount, icon: <Users /> },
        { label: "Total Payments", count: paymentsCount, icon: <DollarSign /> },
        { label: "Paid", count: paidCount, icon: <BadgeCheck /> },
        { label: "Pending", count: pendingCount, icon: <Hourglass /> },
        {
            label: "Total Amount",
            count: `RM ${totalAmount.toFixed(2)}`,
            icon: <DollarSign />,
        },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Main Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((item) => (
                        <Card key={item.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {item.label}
                                </CardTitle>
                                {item.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {item.count}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Rating Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Student Rating
                            </CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <RatingStars
                                    rating={Math.round(avgStudentRating)}
                                    readonly
                                    size="sm"
                                />
                                <span className="text-2xl font-bold">
                                    {avgStudentRating.toFixed(1)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Instructor Rating
                            </CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <RatingStars
                                    rating={Math.round(avgInstructorRating)}
                                    readonly
                                    size="sm"
                                />
                                <span className="text-2xl font-bold">
                                    {avgInstructorRating.toFixed(1)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Ratings
                            </CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalRatings}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
