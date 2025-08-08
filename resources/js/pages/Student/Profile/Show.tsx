import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
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
import { Star, User, Calendar, Award, CreditCard } from "lucide-react";

interface Student {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    grade: string;
    gender: string;
    dob: string;
    nationality: string;
    city: string;
    country: string;
    profile_image: string | null;
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

interface Instructor {
    id: number;
    name: string;
    grade: string;
}

interface Props {
    student: Student;
    ratingsReceived: Rating[];
    instructors: Instructor[];
    stats: {
        certifications_count: number;
        attendances_count: number;
        payments_count: number;
    };
}

const StudentProfile: React.FC<Props> = ({
    student,
    ratingsReceived,
    instructors,
    stats,
}) => {
    const [selectedInstructor, setSelectedInstructor] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");

    const { post, processing, errors } = useForm({
        rated_id: "",
        rated_type: "App\\Models\\Instructor",
        rating: 0,
        comment: "",
    });

    const handleSubmitRating = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInstructor || rating === 0) return;

        post(route("ratings.store"), {
            data: {
                rated_id: selectedInstructor,
                rated_type: "App\\Models\\Instructor",
                rating,
                comment,
            },
            onSuccess: () => {
                setSelectedInstructor("");
                setRating(0);
                setComment("");
            },
        });
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
                                            {student.name} {student.surname}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </Label>
                                        <p className="text-lg">
                                            {student.email}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Phone
                                        </Label>
                                        <p className="text-lg">
                                            {student.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Grade
                                        </Label>
                                        <p className="text-lg">
                                            {student.grade}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Gender
                                        </Label>
                                        <p className="text-lg">
                                            {student.gender}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Date of Birth
                                        </Label>
                                        <p className="text-lg">
                                            {student.dob
                                                ? new Date(
                                                      student.dob
                                                  ).toLocaleDateString()
                                                : "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Nationality
                                        </Label>
                                        <p className="text-lg">
                                            {student.nationality}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            City
                                        </Label>
                                        <p className="text-lg">
                                            {student.city}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Country
                                        </Label>
                                        <p className="text-lg">
                                            {student.country}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Club
                                        </Label>
                                        <p className="text-lg">
                                            {student.club?.name ||
                                                "Not assigned"}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Organization
                                        </Label>
                                        <p className="text-lg">
                                            {student.organization?.name ||
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
                                            <Award className="w-4 h-4 text-blue-500" />
                                            <span>Certifications</span>
                                        </div>
                                        <span className="font-semibold">
                                            {stats.certifications_count}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-500" />
                                            <span>Attendances</span>
                                        </div>
                                        <span className="font-semibold">
                                            {stats.attendances_count}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-purple-500" />
                                            <span>Payments</span>
                                        </div>
                                        <span className="font-semibold">
                                            {stats.payments_count}
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
                                            rating={
                                                typeof student.average_rating ===
                                                "number"
                                                    ? Math.round(
                                                          student.average_rating
                                                      )
                                                    : 0
                                            }
                                            readonly
                                            size="lg"
                                        />
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {typeof student.average_rating ===
                                        "number"
                                            ? student.average_rating.toFixed(1)
                                            : "0.0"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {student.total_ratings} rating
                                        {student.total_ratings !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rate Instructor */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Rate an Instructor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmitRating}
                                    className="space-y-4"
                                >
                                    <div>
                                        <Label htmlFor="instructor">
                                            Select Instructor
                                        </Label>
                                        <Select
                                            value={selectedInstructor}
                                            onValueChange={
                                                setSelectedInstructor
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose an instructor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {instructors.map(
                                                    (instructor) => (
                                                        <SelectItem
                                                            key={instructor.id}
                                                            value={instructor.id.toString()}
                                                        >
                                                            {instructor.name} (
                                                            {instructor.grade})
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Rating</Label>
                                        <RatingStars
                                            rating={rating}
                                            onRatingChange={setRating}
                                            size="md"
                                        />
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
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={
                                            !selectedInstructor ||
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

export default StudentProfile;
