import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eachDayOfInterval, startOfMonth, endOfMonth, format, isWeekend, isSaturday, isSunday } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import axios from "axios";
import { CheckCircle2, XCircle, Clock, Calendar, PartyPopper, Circle } from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

type Student = {
    id: number;
    code: string;
    name: string;
};

type AttendanceRecord = {
    student: Student;
    records: Record<string, AttendanceStatus | undefined>;
};

type HolidayInfo = {
    name: string;
    type: string;
    description?: string;
};

type Props = {
    studentsWithAttendance: AttendanceRecord[];
    holidays?: Record<string, HolidayInfo>;
    filters: {
        date?: string;
    };
};

// Status options for the dropdown
const statusOptions: { value: AttendanceStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "present", label: "Present", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-600" },
    { value: "absent", label: "Absent", icon: <XCircle className="w-4 h-4" />, color: "text-red-500" },
    { value: "late", label: "Late", icon: <Clock className="w-4 h-4" />, color: "text-yellow-500" },
    { value: "excused", label: "Excused", icon: <Calendar className="w-4 h-4" />, color: "text-blue-500" },
];

export default function Index({
    studentsWithAttendance,
    holidays = {},
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

    useEffect(() => {
        const handler = setTimeout(() => {
            const date = `${year}-${month}`;

            router.get(route("club.attendances.index"), { date }, {
                preserveState: true,
                replace: true,
                only: ["studentsWithAttendance", "holidays"],
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [year, month]);

    const monthDate = new Date(`${year}-${month}-01`);
    const days = eachDayOfInterval({
        start: startOfMonth(monthDate),
        end: endOfMonth(monthDate),
    });

    const [attendanceData, setAttendanceData] = useState(
        studentsWithAttendance
    );

    // Update attendance data when props change
    useEffect(() => {
        setAttendanceData(studentsWithAttendance);
    }, [studentsWithAttendance]);

    const handleStatusChange = async (
        studentId: number,
        date: string,
        newStatus: AttendanceStatus
    ) => {
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
    };

    // Helper function to get day info
    const getDayInfo = (day: Date) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const holiday = holidays[dateStr];
        const isWeekendDay = isWeekend(day);
        const isSat = isSaturday(day);
        const isSun = isSunday(day);

        return {
            dateStr,
            holiday,
            isWeekendDay,
            isSat,
            isSun,
            isNonWorkingDay: isWeekendDay || !!holiday,
        };
    };

    // Get status icon
    const getStatusIcon = (status: AttendanceStatus | undefined) => {
        switch (status) {
            case "present":
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case "absent":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "late":
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case "excused":
                return <Calendar className="w-4 h-4 text-blue-500" />;
            default:
                return <Circle className="w-4 h-4 text-gray-300" />;
        }
    };

    // Calculate attendance statistics
    const calculateStats = () => {
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalLate = 0;
        let totalExcused = 0;

        attendanceData.forEach(({ records }) => {
            Object.values(records).forEach((status) => {
                if (status === "present") totalPresent++;
                else if (status === "absent") totalAbsent++;
                else if (status === "late") totalLate++;
                else if (status === "excused") totalExcused++;
            });
        });

        return { totalPresent, totalAbsent, totalLate, totalExcused };
    };

    const stats = calculateStats();

    return (
        <AuthenticatedLayout header="Attendances">
            <Head title="Attendances" />
            <div className="container mx-auto py-5 space-y-4">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Present</p>
                                    <p className="text-2xl font-bold text-green-700">{stats.totalPresent}</p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Absent</p>
                                    <p className="text-2xl font-bold text-red-700">{stats.totalAbsent}</p>
                                </div>
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-600 font-medium">Late</p>
                                    <p className="text-2xl font-bold text-yellow-700">{stats.totalLate}</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Excused</p>
                                    <p className="text-2xl font-bold text-blue-700">{stats.totalExcused}</p>
                                </div>
                                <Calendar className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Legend */}
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="font-medium">Legend:</span>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                                <span>Saturday</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                                <span>Sunday</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
                                <span>Holiday</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>Present</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span>Absent</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-yellow-500" />
                                <span>Late</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>Excused</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Circle className="w-4 h-4 text-gray-300" />
                                <span>Not Marked</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Click on any cell to change the attendance status.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-end gap-4 flex-wrap">
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

                        {/* Show holidays for the month */}
                        {Object.keys(holidays).length > 0 && (
                            <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <PartyPopper className="w-4 h-4 text-purple-600" />
                                    <span className="font-medium text-purple-700">Holidays this month:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(holidays).map(([date, info]) => (
                                        <Badge key={date} variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                                            {format(new Date(date), "MMM d")} - {info.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Attendance Table */}
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[800px]">
                                <TooltipProvider>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="sticky left-0 bg-background z-10 min-w-[150px]">Student</TableHead>
                                                {days.map((day) => {
                                                    const dayInfo = getDayInfo(day);
                                                    return (
                                                        <TableHead
                                                            key={day.toString()}
                                                            className={`text-center min-w-[40px] ${
                                                                dayInfo.holiday
                                                                    ? "bg-purple-100 dark:bg-purple-900/30"
                                                                    : dayInfo.isSun
                                                                    ? "bg-orange-100 dark:bg-orange-900/30"
                                                                    : dayInfo.isSat
                                                                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="cursor-help">
                                                                        <div className="text-xs text-muted-foreground">
                                                                            {format(day, "EEE")}
                                                                        </div>
                                                                        <div>{format(day, "dd")}</div>
                                                                        {dayInfo.holiday && (
                                                                            <PartyPopper className="w-3 h-3 mx-auto text-purple-600" />
                                                                        )}
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{format(day, "EEEE, MMMM d, yyyy")}</p>
                                                                    {dayInfo.holiday && (
                                                                        <p className="text-purple-400 font-medium">{dayInfo.holiday.name}</p>
                                                                    )}
                                                                    {dayInfo.isWeekendDay && !dayInfo.holiday && (
                                                                        <p className="text-yellow-400">Weekend</p>
                                                                    )}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TableHead>
                                                    );
                                                })}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {attendanceData.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={days.length + 1} className="text-center py-8 text-muted-foreground">
                                                        No students found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                attendanceData.map(
                                                    ({ student, records }) => (
                                                        <TableRow key={student.id}>
                                                            <TableCell className="sticky left-0 bg-background z-10">
                                                                <div>
                                                                    <Link
                                                                        href={route(
                                                                            "club.student-insights.show",
                                                                            student.id
                                                                        )}
                                                                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                                    >
                                                                        {student.name}
                                                                    </Link>
                                                                    {student.code && (
                                                                        <div className="text-xs text-muted-foreground">
                                                                            {student.code}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            {days.map((day) => {
                                                                const dayInfo = getDayInfo(day);
                                                                const status = records[dayInfo.dateStr];
                                                                return (
                                                                    <TableCell
                                                                        key={dayInfo.dateStr}
                                                                        className={`text-center p-1 ${
                                                                            dayInfo.holiday
                                                                                ? "bg-purple-50 dark:bg-purple-900/20"
                                                                                : dayInfo.isSun
                                                                                ? "bg-orange-50 dark:bg-orange-900/20"
                                                                                : dayInfo.isSat
                                                                                ? "bg-yellow-50 dark:bg-yellow-900/20"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {dayInfo.isNonWorkingDay ? (
                                                                            // Weekend or Holiday - show dash, no interaction
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <span className="text-gray-400 cursor-not-allowed">—</span>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <p>{format(day, "EEEE, MMMM d")}</p>
                                                                                    {dayInfo.holiday ? (
                                                                                        <p className="text-purple-400">{dayInfo.holiday.name}</p>
                                                                                    ) : (
                                                                                        <p className="text-yellow-400">Weekend - No Class</p>
                                                                                    )}
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        ) : (
                                                                            // Working day - allow attendance marking
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <button
                                                                                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                                                        title="Click to change status"
                                                                                    >
                                                                                        {getStatusIcon(status)}
                                                                                    </button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="center">
                                                                                    {statusOptions.map((option) => (
                                                                                        <DropdownMenuItem
                                                                                            key={option.value}
                                                                                            onClick={() =>
                                                                                                handleStatusChange(
                                                                                                    student.id,
                                                                                                    dayInfo.dateStr,
                                                                                                    option.value
                                                                                                )
                                                                                            }
                                                                                            className={`flex items-center gap-2 ${option.color}`}
                                                                                        >
                                                                                            {option.icon}
                                                                                            <span>{option.label}</span>
                                                                                            {status === option.value && (
                                                                                                <CheckCircle2 className="w-3 h-3 ml-auto" />
                                                                                            )}
                                                                                        </DropdownMenuItem>
                                                                                    ))}
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        )}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    )
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </TooltipProvider>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
