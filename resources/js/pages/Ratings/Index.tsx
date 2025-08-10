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
    rater_name?: string;
    rater_type?: string;
    rated_name?: string;
    rated_type?: string;
}

interface Props {
    ratingsReceived: Rating[];
    ratingsGiven: Rating[];
    averageRating: number;
    totalRatings: number;
}

const RatingsIndex: React.FC<Props> = ({
    ratingsReceived,
    ratingsGiven,
    averageRating,
    totalRatings,
}) => {
    const receivedColumns: ColumnDef<Rating>[] = [
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
            header: "From",
            cell: ({ row }) => (
                <span>
                    {row.original.rater_name} ({row.original.rater_type})
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

    const givenColumns: ColumnDef<Rating>[] = [
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
            header: "To",
            cell: ({ row }) => (
                <span>
                    {row.original.rated_name} ({row.original.rated_type})
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

    return (
        <AuthenticatedLayout header="My Ratings">
            <Head title="My Ratings" />
            <div className="container mx-auto py-10">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Average Rating
                            </CardTitle>
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
                                    size="lg"
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
                                Ratings Given
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-3xl font-bold">
                                {ratingsGiven.length}
                            </span>
                        </CardContent>
                    </Card>
                </div>

                {/* Ratings Received */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Ratings Received ({ratingsReceived.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {ratingsReceived.length > 0 ? (
                            <DataTable
                                columns={receivedColumns}
                                data={ratingsReceived}
                            />
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No ratings received yet.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Ratings Given */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Ratings Given ({ratingsGiven.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {ratingsGiven.length > 0 ? (
                            <DataTable
                                columns={givenColumns}
                                data={ratingsGiven}
                            />
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No ratings given yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default RatingsIndex;
