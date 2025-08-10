import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Star } from "lucide-react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RatingStars from "@/components/RatingStars";

export default function Dashboard({
    studentsCount,
    averageRating,
    totalRatings,
}: {
    studentsCount: number;
    averageRating: number;
    totalRatings: number;
}) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Students
                        </CardTitle>
                        <GraduationCap className="h-6 w-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {studentsCount}
                        </div>
                    </CardContent>
                </Card>

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
                                rating={
                                    typeof averageRating === "number"
                                        ? Math.round(averageRating)
                                        : 0
                                }
                                readonly
                                size="sm"
                            />
                            <span className="text-2xl font-bold">
                                {typeof averageRating === "number"
                                    ? averageRating.toFixed(1)
                                    : "0.0"}
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
                        <div className="text-2xl font-bold">{totalRatings}</div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
