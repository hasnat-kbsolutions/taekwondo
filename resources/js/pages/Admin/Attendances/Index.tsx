import React, { useEffect, useState, useRef } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

import { Head, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from "date-fns";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import axios from "axios";

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

type Student = {
    id: number;
    name: string;
};

type AttendanceRecord = {
    student: Student;
    records: Record<string, "present" | "absent" | undefined>; // e.g. { "2025-06-01": "present" }
};

type SelectOption = {
    id: number;
    name: string;
};

type Props = {
    studentsWithAttendance: AttendanceRecord[];
    branches: SelectOption[];
    organizations: SelectOption[];
    clubs: SelectOption[];
    filters: {
        branch_id?: string;
        organization_id?: string;
        club_id?: string;
        date?: string;
    };
};

export default function Index({
    studentsWithAttendance,
    branches,
    organizations,
    clubs,
    filters: defaultFilters,
}: Props) {
    const [filters, setFilters] = useState(() => ({
        branch_id: defaultFilters.branch_id || "",
        organization_id: defaultFilters.organization_id || "",
        club_id: defaultFilters.club_id || "",
        date: defaultFilters.date || format(new Date(), "yyyy-MM"),
    }));

    // Stable reference for comparison
    const defaultFiltersRef = useRef(defaultFilters);

    useEffect(() => {
        const handler = setTimeout(() => {
            const filtersChanged =
                JSON.stringify(filters) !==
                JSON.stringify(defaultFiltersRef.current);

            if (filtersChanged) {
                router.get(route("admin.attendances.index"), filters, {
                    preserveState: true,
                    replace: true,
                    only: ["studentsWithAttendance"],
                    onFinish: () => console.log("Request completed"),
                });
            }
        }, 500); // Delay in ms

        return () => clearTimeout(handler);
    }, [filters]);

    const monthDate = filters.date
        ? new Date(filters.date + "-01")
        : new Date();

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

    return (
        <AuthenticatedLayout header="Attendances">
            <Head title="Attendances" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Select
                                value={filters.branch_id}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        branch_id: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Branches" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {branches.map((c: any) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.organization_id}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        organization_id: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Organizations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {organizations.map((o: any) => (
                                            <SelectItem
                                                key={o.id}
                                                value={String(o.id)}
                                            >
                                                {o.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.club_id}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        club_id: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Clubs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {clubs.map((c: any) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <div className="grid gap-2">
                                <input
                                    id="month-picker"
                                    type="month"
                                    value={filters.date}
                                    onChange={(e) => {
                                        setFilters((prev) => ({
                                            ...prev,
                                            date: e.target.value,
                                        }));
                                    }}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                        </div>

                        {/* Attendance Table */}
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[800px]">
                                {" "}
                                {/* minimum width to allow scrolling on small screens */}
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
                                            ({ student, records }: any) => (
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
