import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building2, MapPin, Phone, Mail, Calendar, BookOpen, ArrowLeft, TrendingUp } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    surname: string;
    dob: string;
    phone: string;
    street?: string;
    city: string;
    country: string;
    postal_code: string;
    status: boolean;
    grade: string;
    nationality: string;
    id_passport: string;
    gender: string;
    profile_image?: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    club?: {
        id: number;
        name: string;
    };
    organization?: {
        id: number;
        name: string;
    };
}

interface GradeHistory {
    id: number;
    grade_name: string;
    achieved_at: string;
    achieved_at_formatted: string;
    duration_days: number | null;
    duration_formatted: string;
    notes: string | null;
}

interface Props {
    student: Student;
    gradeHistory?: GradeHistory[];
}

export default function ShowStudent({ student, gradeHistory = [] }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Student Profile" />

            <div className="py-6 space-y-6">
                {/* Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-center space-x-6">
                                {/* Profile Image */}
                                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                                    {student.profile_image ? (
                                        <img
                                            src={`/storage/${student.profile_image}`}
                                            alt={student.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-10 w-10 text-muted-foreground" />
                                    )}
                                </div>

                                {/* Student Info */}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-foreground mb-2">
                                        {student.name} {student.surname}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <span className="text-lg text-muted-foreground font-medium">
                                            {student.grade}
                                        </span>
                                        <span className="text-muted-foreground">•</span>
                                        {student.club && (
                                            <>
                                                <span className="text-lg text-muted-foreground">
                                                    {student.club.name}
                                                </span>
                                                <span className="text-muted-foreground">•</span>
                                            </>
                                        )}
                                        {student.organization && (
                                            <span className="text-lg text-muted-foreground">
                                                {student.organization.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant={student.status ? "default" : "destructive"}
                                            className={
                                                student.status
                                                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                                    : "bg-red-500/10 text-red-700 dark:text-red-400"
                                            }
                                        >
                                            {student.status ? "Active" : "Inactive"}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                        >
                                            {student.gender}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                        >
                                            {student.nationality}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Back Button */}
                            <div>
                                <Link href={route("organization.students.index")}>
                                    <Button variant="outline">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Students
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-blue-500/5 border-blue-200 dark:border-blue-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                Grade
                            </CardTitle>
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                {student.grade}
                            </div>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Current grade level
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-500/5 border-green-200 dark:border-green-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                                Gender
                            </CardTitle>
                            <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100 capitalize">
                                {student.gender}
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                Student gender
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-500/5 border-purple-200 dark:border-purple-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
                                Nationality
                            </CardTitle>
                            <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {student.nationality.substring(0, 3).toUpperCase()}
                            </div>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                {student.nationality}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-yellow-500/5 border-yellow-200 dark:border-yellow-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                                ID/Passport
                            </CardTitle>
                            <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-yellow-900 dark:text-yellow-100 truncate">
                                {student.id_passport}
                            </div>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                Identification number
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact & Address Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <Mail className="h-5 w-5 text-primary" />
                                <span>Contact Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {student.user && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <p className="text-lg font-semibold">{student.user.email}</p>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                <p className="text-lg font-semibold flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {student.phone}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                                <p className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {student.dob}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span>Address Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {student.street && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Street</label>
                                    <p className="text-lg font-semibold">{student.street}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">City</label>
                                    <p className="text-lg font-semibold">{student.city}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                                    <p className="text-lg font-semibold">{student.postal_code}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Country</label>
                                <p className="text-lg font-semibold">{student.country}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grade Progression Timeline */}
                {gradeHistory && gradeHistory.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Grade Progression Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {gradeHistory.map((history, index) => (
                                    <div
                                        key={history.id}
                                        className="flex gap-4 pb-4 last:pb-0 border-b last:border-b-0"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                                                {index + 1}
                                            </div>
                                            {index < gradeHistory.length - 1 && (
                                                <div className="w-0.5 h-12 bg-border mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-base font-semibold">
                                                    {history.grade_name}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {history.achieved_at_formatted}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Duration: {history.duration_formatted}
                                            </p>
                                            {history.notes && (
                                                <p className="text-sm text-foreground italic">
                                                    {history.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
