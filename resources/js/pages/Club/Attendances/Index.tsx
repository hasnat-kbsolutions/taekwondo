import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
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
    filters: {
        club_id?: string;
        date?: string;
    };
};

export default function Index({
    studentsWithAttendance,
    clubs,
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
    const [filters, setFilters] = useState(() => ({})); // Removed club_id

    useEffect(() => {
        const handler = setTimeout(() => {
            const date = `${year}-${month}`;
            const updated = { date }; // Removed club_id from filter object

            router.get(route("club.attendances.index"), updated, {
                preserveState: true,
                replace: true,
                only: ["studentsWithAttendance"],
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [year, month]); // Removed filters.club_id

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
            await axios.post(route("club.attendances.toggle"), {
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
        // Removed club_id reset
    };

    return (
        <AuthenticatedLayout header="Attendances">
            <Head title="Attendances" />
            <div className="container mx-auto py-5">
                {/* Filters Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
                            {/* Removed Club Filter */}
                            {/* Year Filter */}
                            <div className="flex flex-col w-[200px]">
                                <Label className="text-sm mb-1">Year</Label>
                                <Select value={year} onValueChange={setYear}>
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
                                <Label className="text-sm mb-1">Month</Label>
                                <Select value={month} onValueChange={setMonth}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const m = (i + 1)
                                                .toString()
                                                .padStart(2, "0");
                                            return (
                                                <SelectItem key={m} value={m}>
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
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reset Button */}
                            <div className="flex items-end">
                                <Button
                                    className="bg-primary text-background"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Table Section */}
            <div className="container mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance List</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                                        {student.name}
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
