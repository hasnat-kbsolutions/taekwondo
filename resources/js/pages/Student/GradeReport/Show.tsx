import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Award,
    TrendingUp,
    Calendar,
    Wallet,
} from 'lucide-react';

interface GradeHistory {
    id: number;
    grade_name: string;
    achieved_at: string;
    achieved_at_formatted: string;
    duration_days: number | null;
    duration_formatted: string;
    notes: string | null;
}

interface Payment {
    id: number;
    amount: number;
    currency: string;
    payment_date: string;
    payment_date_formatted: string;
    status: string;
    description: string | null;
    payment_method: string | null;
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
    payments: Payment[];
    stats: Stats;
}

export default function GradeReportShow({
    student,
    gradeHistory,
    payments,
    stats,
}: Props) {
    const [activeTab, setActiveTab] = useState('grades');

    const getPaymentStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AuthenticatedLayout header="My Grades & Payments">
            <Head title="My Grades & Payments" />

            <div className="container mx-auto py-10 space-y-6">
                {/* Header */}
                <Card>
                    <CardContent className="p-6">
                        <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                            <span>Code: {student.code}</span>
                            <span>•</span>
                            <span>Current Grade: <span className="font-semibold text-foreground">{student.grade}</span></span>
                            {student.club && (
                                <>
                                    <span>•</span>
                                    <span>Club: {student.club}</span>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-blue-500/5 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Grades Achieved
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {stats.total_grades_achieved}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-500/5 border-green-200 dark:border-green-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Total Days
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                {stats.total_progression_days}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-500/5 border-purple-200 dark:border-purple-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Avg Days/Grade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {Math.round(stats.average_days_per_grade)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-500/5 border-orange-200 dark:border-orange-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
                                <Wallet className="w-4 h-4" />
                                Payments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                {payments.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for Grades and Payments */}
                <Card>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 m-4">
                            <TabsTrigger value="grades">Grade Progression</TabsTrigger>
                            <TabsTrigger value="payments">Payment History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="grades" className="p-6">
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
                                                {index <
                                                    gradeHistory.length - 1 && (
                                                    <div className="w-0.5 h-12 bg-border mt-2" />
                                                )}
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-lg font-semibold px-3 py-1"
                                                    >
                                                        {history.grade_name}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {
                                                            history.achieved_at_formatted
                                                        }
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
                        </TabsContent>

                        <TabsContent value="payments" className="p-6">
                            {payments.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-semibold">
                                                    Date
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold">
                                                    Amount
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold">
                                                    Status
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold">
                                                    Method
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold">
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((payment) => (
                                                <tr
                                                    key={payment.id}
                                                    className="border-b hover:bg-muted/50"
                                                >
                                                    <td className="py-3 px-4">
                                                        {
                                                            payment.payment_date_formatted
                                                        }
                                                    </td>
                                                    <td className="py-3 px-4 font-semibold">
                                                        {payment.amount}{' '}
                                                        {payment.currency}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge
                                                            className={getPaymentStatusColor(
                                                                payment.status
                                                            )}
                                                        >
                                                            {payment.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {payment.payment_method || '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-muted-foreground">
                                                        {payment.description || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    No payment history available
                                </p>
                            )}
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
