import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/RatingStars";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface Rating {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    rater_name: string;
    rater_type: string;
    rated_name: string;
    rated_type: string;
}

interface Stats {
    total_ratings: number;
    average_rating: number;
    students_rated: number;
    instructors_rated: number;
    rating_distribution: {
        '5_stars': number;
        '4_stars': number;
        '3_stars': number;
        '2_stars': number;
        '1_stars': number;
    };
}

interface Props {
    ratings: Rating[];
    stats?: Stats;
    userType?: string;
}

const AdminRatingsIndex: React.FC<Props> = ({ ratings, stats, userType }) => {
    const columns: ColumnDef<Rating>[] = [
        {
            header: "#",
            cell: ({ row }) => row.index + 1,
        },
        {
            header: "Rating",
            cell: ({ row }) => (
                <RatingStars rating={row.original.rating} readonly size="sm" />
            ),
        },
        {
            header: "From",
            cell: ({ row }) => (
                <span>
                    {row.original.rater_name} ({row.original.rater_type})
                </span>
            ),
        },
        {
            header: "To",
            cell: ({ row }) => (
                <span>
                    {row.original.rated_name} ({row.original.rated_type})
                </span>
            ),
        },
        {
            header: "Comment",
            cell: ({ row }) => (
                <span
                    className="max-w-xs truncate"
                    title={row.original.comment || ""}
                >
                    {row.original.comment || "No comment"}
                </span>
            ),
        },
        {
            header: "Date",
            cell: ({ row }) => (
                <span>
                    {new Date(row.original.created_at).toLocaleDateString()}
                </span>
            ),
        },
    ];

    // Use stats if provided, otherwise calculate basic stats
    const totalRatings = stats?.total_ratings ?? ratings.length;
    const avgRating = stats?.average_rating ?? (
        totalRatings > 0
            ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
            : 0
    );

    const isOrganization = userType === 'Organization';

    return (
        <AuthenticatedLayout header="Ratings Overview">
            <Head title="Ratings Overview" />
            <div className="container mx-auto py-10">
                {isOrganization && stats ? (
                    // Enhanced stats for organizations
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Total Ratings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="text-3xl font-bold">{stats.total_ratings}</span>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Average Rating</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <RatingStars
                                        rating={Math.round(stats.average_rating)}
                                        readonly
                                        size="sm"
                                    />
                                    <span className="text-2xl font-bold">
                                        {stats.average_rating.toFixed(1)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Students Rated</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="text-3xl font-bold">{stats.students_rated}</span>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Instructors Rated</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="text-3xl font-bold">{stats.instructors_rated}</span>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    // Basic stats for other user types
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Total Ratings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="text-3xl font-bold">{totalRatings}</span>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Average Rating</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <RatingStars
                                        rating={Math.round(avgRating)}
                                        readonly
                                        size="sm"
                                    />
                                    <span className="text-2xl font-bold">
                                        {avgRating.toFixed(1)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Rating Distribution Chart for Organizations */}
                {isOrganization && stats && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Rating Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-4">
                                {Object.entries(stats.rating_distribution).map(([key, count]) => (
                                    <div key={key} className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {count}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {key.replace('_', ' ').replace('stars', '★')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isOrganization ? 'Student & Instructor Ratings' : 'All Ratings'} ({ratings.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {ratings.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={ratings}
                            />
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No ratings found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default AdminRatingsIndex;
