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

interface Props {
    ratings: Rating[];
}

const AdminRatingsIndex: React.FC<Props> = ({ ratings }) => {
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

    const totalRatings = ratings.length;
    const avgRating =
        totalRatings > 0
            ? ratings.reduce((sum, rating) => sum + rating.rating, 0) /
              totalRatings
            : 0;

    return (
        <AuthenticatedLayout header="Ratings Overview">
            <Head title="Ratings Overview" />
            <div className="container mx-auto py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Total Ratings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-3xl font-bold">
                                {totalRatings}
                            </span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Average Rating
                            </CardTitle>
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

                <Card>
                    <CardHeader>
                        <CardTitle>All Ratings ({ratings.length})</CardTitle>
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
