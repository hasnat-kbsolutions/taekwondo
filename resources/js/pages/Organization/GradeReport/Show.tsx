import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Award, TrendingUp } from 'lucide-react';

interface GradeHistory {
    id: number;
    grade_name: string;
    achieved_at: string;
    achieved_at_formatted: string;
    duration_days: number | null;
    duration_formatted: string;
    notes: string | null;
}

interface Stats {
    total_grades_achieved: number;
    current_grade: string;
    first_grade_date: string | null;
    latest_grade_date: string | null;
    total_progression_days: number;
    average_days_per_grade: number;
}

interface Props {
    student: {
        id: number;
        name: string;
        code: string;
        grade: string;
        club: string | null;
        profile_image: string | null;
    };
    gradeHistory: GradeHistory[];
    stats: Stats;
}

export default function GradeReportShow({
    student,
    gradeHistory,
    stats,
}: Props) {
    return (
        <AuthenticatedLayout header="Grade Report">
            <Head title={`Grade Report - ${student.name}`} />

            <div className="container mx-auto py-10 space-y-6">
                {/* Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    {student.name}
                                </h1>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <span>Code: {student.code}</span>
                                    {student.club && (
                                        <>
                                            <span>•</span>
                                            <span>Club: {student.club}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Link href={route('organization.grade-reports.index')}>
                                <Button variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Reports
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-blue-500/5 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Current Grade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {student.grade}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-500/5 border-green-200 dark:border-green-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Grades Achieved
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                {stats.total_grades_achieved}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-500/5 border-purple-200 dark:border-purple-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Total Days
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {stats.total_progression_days}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-500/5 border-orange-200 dark:border-orange-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Avg Days/Grade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                {Math.round(stats.average_days_per_grade)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grade History Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Progression Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {gradeHistory.length > 0 ? (
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
                                                <Badge variant="outline">
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
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                No grade history available
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
