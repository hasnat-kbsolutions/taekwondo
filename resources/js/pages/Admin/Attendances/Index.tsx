import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import axios from "axios";

type Student = {
    id: number;
    name: string;
};

type AttendanceRecord = {
    student: Student;
    records: Record<string, "present" | "absent" | undefined>;
};

type SelectOption = {
    id: number;
    name: string;
};

type Props = {
    studentsWithAttendance: AttendanceRecord[];
    clubs: SelectOption[];
    organizations: SelectOption[];
    filters: {
        club_id?: string;
        organization_id?: string;
        date?: string;
    };
};

export default function Index({
    studentsWithAttendance,
    clubs,
    organizations,
    filters: defaultFilters,
}: Props) {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0");

    const [year, setYear] = useState(
        defaultFilters.date?.split("-")[0] || currentYear.toString()
    );
    const [month, setMonth] = useState(
        defaultFilters.date?.split("-")[1] || currentMonth
    );
    const [filters, setFilters] = useState(() => ({
        club_id: defaultFilters.club_id || "",
        organization_id: defaultFilters.organization_id || "",
    }));

    useEffect(() => {
        const handler = setTimeout(() => {
            const date = `${year}-${month}`;
            const updated = { ...filters, date };

            router.get(route("admin.attendances.index"), updated, {
                preserveState: true,
                replace: true,
                only: ["studentsWithAttendance"],
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [year, month, filters.club_id, filters.organization_id]);

    const monthDate = new Date(`${year}-${month}-01`);
    const days = eachDayOfInterval({
        start: startOfMonth(monthDate),
        end: endOfMonth(monthDate),
    });

    const [attendanceData, setAttendanceData] = useState(
        studentsWithAttendance
    );

    const handleAttendanceToggle = async (
        studentId: number,
        date: string,
        checked: boolean
    ) => {
        const newStatus = checked ? "present" : "absent";

        try {
            await axios.post(route("admin.attendances.toggle"), {
                student_id: studentId,
                date,
                status: newStatus,
            });

            setAttendanceData((prevData) =>
                prevData.map((entry) => ({
                    ...entry,
                    records:
                        entry.student.id === studentId
                            ? { ...entry.records, [date]: newStatus }
                            : entry.records,
                }))
            );

            toast.success(`Attendance marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update attendance");
        }
    };

    const resetFilters = () => {
        setYear(currentYear.toString());
        setMonth(currentMonth);
        setFilters({
            club_id: "",
            organization_id: "",
        });
    };

    return (
        <AuthenticatedLayout header="Attendances">
            <Head title="Attendances" />
            <div className="container mx-auto py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-end gap-4 flex-wrap">
                                {/* Club Filter */}
                                <div className="flex flex-col w-[200px]">
                                    <Label className="text-sm mb-1">Club</Label>
                                    <Select
                                        value={filters.club_id}
                                        onValueChange={(value) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                club_id: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Clubs" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            {clubs.map((club) => (
                                                <SelectItem
                                                    key={club.id}
                                                    value={club.id.toString()}
                                                >
                                                    {club.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Year Filter */}
                                <div className="flex flex-col w-[200px]">
                                    <Label className="text-sm mb-1">Year</Label>
                                    <Select
                                        value={year}
                                        onValueChange={setYear}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 5 }, (_, i) =>
                                                (currentYear - i).toString()
                                            ).map((yr) => (
                                                <SelectItem key={yr} value={yr}>
                                                    {yr}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Month Filter */}
                                <div className="flex flex-col w-[200px]">
                                    <Label className="text-sm mb-1">
                                        Month
                                    </Label>
                                    <Select
                                        value={month}
                                        onValueChange={setMonth}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(
                                                { length: 12 },
                                                (_, i) => {
                                                    const m = (i + 1)
                                                        .toString()
                                                        .padStart(2, "0");
                                                    return (
                                                        <SelectItem
                                                            key={m}
                                                            value={m}
                                                        >
                                                            {new Date(
                                                                0,
                                                                i
                                                            ).toLocaleString(
                                                                "default",
                                                                {
                                                                    month: "long",
                                                                }
                                                            )}
                                                        </SelectItem>
                                                    );
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Reset Button */}
                                <div className="flex items-end">
                                    <Button
                                        variant="secondary"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Table */}
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[800px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            {days.map((day) => (
                                                <TableHead
                                                    key={day.toString()}
                                                    className="text-center min-w-[40px]"
                                                >
                                                    {format(day, "dd")}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceData.map(
                                            ({ student, records }) => (
                                                <TableRow key={student.id}>
                                                    <TableCell>
                                                        <Link
                                                            href={route(
                                                                "admin.student-insights.show",
                                                                student.id
                                                            )}
                                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                        >
                                                            {student.name}
                                                        </Link>
                                                    </TableCell>
                                                    {days.map((day) => {
                                                        const d = format(
                                                            day,
                                                            "yyyy-MM-dd"
                                                        );
                                                        const status =
                                                            records[d];
                                                        return (
                                                            <TableCell
                                                                key={d}
                                                                className="text-center"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        status ===
                                                                        "present"
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleAttendanceToggle(
                                                                            student.id,
                                                                            d,
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                />
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
