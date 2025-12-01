import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    code: string;
    club: string | null;
    current_grade: string;
    grades_achieved: number;
    started_date: string | null;
    latest_achievement: string | null;
    total_days_progressing: number;
    history_count: number;
}

interface Props {
    students: Student[];
}

const columns: ColumnDef<Student>[] = [
    {
        header: '#',
        cell: ({ row }) => row.index + 1,
        size: 50,
    },
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'name',
        header: 'Student Name',
    },
    {
        accessorKey: 'club',
        header: 'Club',
    },
    {
        accessorKey: 'current_grade',
        header: 'Current Grade',
        cell: ({ row }) => (
            <Badge variant="outline">{row.original.current_grade}</Badge>
        ),
    },
    {
        accessorKey: 'grades_achieved',
        header: 'Grades Achieved',
        cell: ({ row }) => (
            <span className="font-semibold">{row.original.grades_achieved}</span>
        ),
    },
    {
        accessorKey: 'started_date',
        header: 'Started',
    },
    {
        accessorKey: 'latest_achievement',
        header: 'Latest Achievement',
    },
    {
        header: 'Actions',
        cell: ({ row }) => (
            <Link href={route('club.grade-reports.show', row.original.id)}>
                <Button variant="ghost" size="sm" title="View Details">
                    <Eye className="w-4 h-4 text-blue-600" />
                </Button>
            </Link>
        ),
    },
];

export default function GradeReportIndex({ students }: Props) {
    return (
        <AuthenticatedLayout header="Grade Reports">
            <Head title="Grade Reports" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Progression Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground">
                                View the grade progression history for all your club
                                students
                            </p>
                        </div>

                        <DataTable columns={columns} data={students} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
