import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import RatingStars from "@/components/RatingStars";
import {
    User,
    Users,
    Building2,
    MapPin,
    Globe,
    Phone,
    Mail,
    Star,
    Calendar,
    Award,
    CreditCard,
    TrendingUp,
    Users2,
    GraduationCap,
} from "lucide-react";

interface Club {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    city: string;
    country: string;
    street: string;
    postal_code: string;
    status: string;
    tax_number?: string;
    invoice_prefix?: string;
    logo?: string;
    notification_emails?: string;
    organization?: {
        id: number;
        name: string;
    };
    average_rating?: number;
    total_ratings?: number;
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

interface Instructor {
    id: number;
    name: string;
    grade: string;
}

interface Props {
    club: Club;
    ratingsReceived?: Rating[];
    students?: Student[];
    instructors?: Instructor[];
    stats?: {
        students_count: number;
        instructors_count: number;
        certifications_count: number;
        attendances_count: number;
        payments_count: number;
    };
}

export default function Show({
    club,
    ratingsReceived = [],
    students = [],
    instructors = [],
    stats = {
        students_count: 0,
        instructors_count: 0,
        certifications_count: 0,
        attendances_count: 0,
        payments_count: 0,
    },
}: Props) {
    return (
        <AuthenticatedLayout header="Club Profile">
            <Head title="Club Profile" />

            <div className="container mx-auto py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Club Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Logo
                                        </Label>
                                        <div className="mt-2">
                                            {club.logo ? (
                                                <img
                                                    src={`/storage/${club.logo}`}
                                                    alt={`${club.name} Logo`}
                                                    className="w-20 h-20 object-cover rounded-lg border"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-lg border bg-muted flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-muted-foreground">
                                                        {club.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Name
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {club.name}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </Label>
                                        <Badge
                                            variant={
                                                club.status === "active"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {club.status}
                                        </Badge>
                                    </div>

                                    {club.organization && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Organization
                                            </Label>
                                            <p className="text-lg font-semibold text-blue-600">
                                                {club.organization.name}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </Label>
                                        <p className="text-lg flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {club.email}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Phone
                                        </Label>
                                        <p className="text-lg flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {club.phone}
                                        </p>
                                    </div>

                                    {club.website && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Website
                                            </Label>
                                            <p className="text-lg flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                <a
                                                    href={club.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {club.website}
                                                </a>
                                            </p>
                                        </div>
                                    )}

                                    {club.tax_number && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Tax Number
                                            </Label>
                                            <p className="text-lg">
                                                {club.tax_number}
                                            </p>
                                        </div>
                                    )}

                                    {club.invoice_prefix && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Invoice Prefix
                                            </Label>
                                            <p className="text-lg">
                                                {club.invoice_prefix}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Address Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Street
                                        </Label>
                                        <p className="text-lg">{club.street}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            City
                                        </Label>
                                        <p className="text-lg">{club.city}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Postal Code
                                        </Label>
                                        <p className="text-lg">
                                            {club.postal_code}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Country
                                        </Label>
                                        <p className="text-lg">
                                            {club.country}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ratings Received */}
                        {ratingsReceived && ratingsReceived.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        Ratings Received (
                                        {ratingsReceived.length})
                                        {club.average_rating && (
                                            <div className="flex items-center gap-2 ml-auto">
                                                <RatingStars
                                                    rating={club.average_rating}
                                                    readonly
                                                    size="sm"
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {club.average_rating.toFixed(
                                                        1
                                                    )}{" "}
                                                    ({club.total_ratings}{" "}
                                                    ratings)
                                                </span>
                                            </div>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
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
                                                        <span className="font-medium">
                                                            {rating.rater_name}
                                                        </span>
                                                        <Badge variant="outline">
                                                            {rating.rater_type}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            rating.created_at
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {rating.comment && (
                                                    <p className="text-muted-foreground">
                                                        {rating.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users2 className="h-5 w-5 text-blue-600" />
                                        <span>Students</span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.students_count}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-green-600" />
                                        <span>Instructors</span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.instructors_count}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Award className="h-5 w-5 text-yellow-600" />
                                        <span>Certifications</span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.certifications_count}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-purple-600" />
                                        <span>Attendances</span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.attendances_count}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-red-600" />
                                        <span>Payments</span>
                                    </div>
                                    <span className="font-semibold">
                                        {stats.payments_count}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Quick Actions
                                </CardTitle>
                                <CardDescription>
                                    Manage your club's resources
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() =>
                                            (window.location.href = route(
                                                "club.students.index"
                                            ))
                                        }
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Manage Students
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() =>
                                            (window.location.href = route(
                                                "club.instructors.index"
                                            ))
                                        }
                                    >
                                        <GraduationCap className="h-4 w-4 mr-2" />
                                        Manage Instructors
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() =>
                                            (window.location.href = route(
                                                "club.certifications.index"
                                            ))
                                        }
                                    >
                                        <Award className="h-4 w-4 mr-2" />
                                        Manage Certifications
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() =>
                                            (window.location.href = route(
                                                "club.attendances.index"
                                            ))
                                        }
                                    >
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Manage Attendances
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() =>
                                            (window.location.href = route(
                                                "club.payments.index"
                                            ))
                                        }
                                    >
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Manage Payments
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
