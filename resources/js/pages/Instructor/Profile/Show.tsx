import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RatingStars from "@/components/RatingStars";
import { Star, User, Users, Award } from "lucide-react";

interface Instructor {
    id: number;
    name: string;
    email: string;
    mobile: string;
    grade: string;
    address: string;
    ic_number: string;
    profile_picture: string | null;
    club: { id: number; name: string } | null;
    organization: { id: number; name: string } | null;
    average_rating: number;
    total_ratings: number;
}

interface Rating {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    rater_name: string;
    rater_type: string;
}

interface Student {
    id: number;
    name: string;
    surname: string;
    grade: string;
}

interface Props {
    instructor: Instructor;
    ratingsReceived: Rating[];
    students: Student[];
    stats: {
        students_count: number;
    };
}

const InstructorProfile: React.FC<Props> = ({
    instructor,
    ratingsReceived,
    students,
    stats,
}) => {
    const [selectedStudent, setSelectedStudent] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");

    const { post, processing, errors } = useForm({
        rated_id: "",
        rated_type: "App\\Models\\Student",
        rating: 0,
        comment: "",
    });

    const handleSubmitRating = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.post(
            route("ratings.store"),
            {
                rated_id: selectedStudent,
                rated_type: "App\\Models\\Student",
                rating,
                comment,
            },
            {
                onSuccess: () => {
                    setSelectedStudent("");
                    setRating(0);
                    setComment("");
                },
            }
        );
    };

    return (
        <AuthenticatedLayout header="My Profile">
            <Head title="My Profile" />
            <div className="container mx-auto py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Name
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {instructor.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.email}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Mobile
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.mobile}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Grade
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.grade}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            IC Number
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.ic_number}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Address
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.address}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Club
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.club?.name ||
                                                "Not assigned"}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Organization
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.organization?.name ||
                                                "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ratings Received */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Ratings Received ({ratingsReceived.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {ratingsReceived.length > 0 ? (
                                    <div className="space-y-4">
                                        {ratingsReceived.map((rating) => (
                                            <div
                                                key={rating.id}
                                                className="border rounded-lg p-4"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <RatingStars
                                                            rating={
                                                                rating.rating
                                                            }
                                                            readonly
                                                            size="sm"
                                                        />
                                                        <span className="text-sm text-muted-foreground">
                                                            by{" "}
                                                            {rating.rater_name}{" "}
                                                            ({rating.rater_type}
                                                            )
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            rating.created_at
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {rating.comment && (
                                                    <p className="text-sm">
                                                        {rating.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">
                                        No ratings received yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span>Students</span>
                                        </div>
                                        <span className="font-semibold">
                                            {stats.students_count}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Average Rating */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Average Rating</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <RatingStars
                                            rating={Math.round(
                                                instructor.average_rating
                                            )}
                                            readonly
                                            size="lg"
                                        />
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {typeof instructor.average_rating ===
                                        "number"
                                            ? instructor.average_rating.toFixed(
                                                  1
                                              )
                                            : "0.0"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {instructor.total_ratings} rating
                                        {instructor.total_ratings !== 1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rate Student */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Rate a Student</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmitRating}
                                    className="space-y-4"
                                >
                             
                                    <div>
                                        <Label htmlFor="student">
                                            Select Student
                                        </Label>
                                        <Select
                                            value={selectedStudent}
                                            onValueChange={setSelectedStudent}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a student" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {students.map((student) => (
                                                    <SelectItem
                                                        key={student.id}
                                                        value={student.id.toString()}
                                                    >
                                                        {student.name}{" "}
                                                        {student.surname} (
                                                        {student.grade})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.rated_id && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.rated_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Rating</Label>
                                        <RatingStars
                                            rating={rating}
                                            onRatingChange={setRating}
                                            size="md"
                                        />
                                        {errors.rating && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.rating}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="comment">
                                            Comment (Optional)
                                        </Label>
                                        <Textarea
                                            id="comment"
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                            placeholder="Share your experience..."
                                            rows={3}
                                        />
                                        {errors.comment && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.comment}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={
                                            !selectedStudent ||
                                            rating === 0 ||
                                            processing
                                        }
                                        className="w-full"
                                    >
                                        {processing
                                            ? "Submitting..."
                                            : "Submit Rating"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default InstructorProfile;
