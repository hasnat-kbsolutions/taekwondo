import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eachDayOfInterval, startOfMonth, endOfMonth, format, isWeekend, isSaturday, isSunday } from "date-fns";
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
import { CheckCircle2, XCircle, Clock, Calendar, PartyPopper } from "lucide-react";

type HolidayInfo = {
    name: string;
    type: string;
    description?: string;
};

interface Props {
    attendance: Record<string, "present" | "absent" | "late" | "excused">;
    holidays?: Record<string, HolidayInfo>;
    stats: {
        present: number;
        absent: number;
        late: number;
        excused: number;
    };
    filters: {
        year: number;
        month: string;
    };
}

export default function Index({ attendance, holidays = {}, stats, filters }: Props) {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

    const [year, setYear] = useState(filters.year?.toString() || currentYear.toString());
    const [month, setMonth] = useState(filters.month || currentMonth);

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(
                route("student.attendances.index"),
                { year, month },
                {
                    preserveState: true,
                    replace: true,
                    only: ["attendance", "holidays", "stats"],
                }
            );
        }, 300);

        return () => clearTimeout(handler);
    }, [year, month]);

    const monthDate = new Date(`${year}-${month}-01`);
    const days = eachDayOfInterval({
        start: startOfMonth(monthDate),
        end: endOfMonth(monthDate),
    });

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
    const getStatusIcon = (status: string | undefined, isNonWorkingDay: boolean) => {
        if (isNonWorkingDay && !status) {
            return <span className="text-gray-300">-</span>;
        }

        switch (status) {
            case "present":
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case "absent":
                return <XCircle className="w-5 h-5 text-red-500" />;
            case "late":
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case "excused":
                return <Calendar className="w-5 h-5 text-blue-500" />;
            default:
                return <span className="text-gray-300">-</span>;
        }
    };

    // Calculate attendance percentage
    const totalMarked = stats.present + stats.absent + stats.late + stats.excused;
    const attendanceRate = totalMarked > 0
        ? Math.round(((stats.present + stats.late) / totalMarked) * 100)
        : 0;

    return (
        <AuthenticatedLayout header="My Attendance">
            <Head title="My Attendance" />
            <div className="container mx-auto py-5 space-y-4">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Present</p>
                                    <p className="text-2xl font-bold text-green-700">{stats.present}</p>
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
                                    <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
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
                                    <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
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
                                    <p className="text-2xl font-bold text-blue-700">{stats.excused}</p>
                                </div>
                                <Calendar className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">Attendance Rate</p>
                                    <p className="text-2xl font-bold text-purple-700">{attendanceRate}%</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                    <span className="text-purple-700 font-bold text-xs">%</span>
                                </div>
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
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>My Attendance Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-end gap-4 flex-wrap">
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
                                                const m = (i + 1).toString().padStart(2, "0");
                                                return (
                                                    <SelectItem key={m} value={m}>
                                                        {new Date(0, i).toLocaleString("default", {
                                                            month: "long",
                                                        })}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Reset Button */}
                                <div className="flex items-end">
                                    <Button variant="secondary" onClick={resetFilters}>
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
                                        <Badge
                                            key={date}
                                            variant="outline"
                                            className="bg-purple-100 text-purple-700 border-purple-300"
                                        >
                                            {format(new Date(date), "MMM d")} - {info.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Attendance Calendar View */}
                        <div className="w-full overflow-x-auto">
                            <TooltipProvider>
                                <div className="grid grid-cols-7 gap-2 min-w-[600px]">
                                    {/* Day headers */}
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                        <div
                                            key={day}
                                            className="text-center font-medium text-sm py-2 text-muted-foreground"
                                        >
                                            {day}
                                        </div>
                                    ))}

                                    {/* Empty cells for days before the first day of the month */}
                                    {Array.from({ length: startOfMonth(monthDate).getDay() }).map((_, i) => (
                                        <div key={`empty-${i}`} className="p-2"></div>
                                    ))}

                                    {/* Calendar days */}
                                    {days.map((day) => {
                                        const dayInfo = getDayInfo(day);
                                        const status = attendance[dayInfo.dateStr];

                                        return (
                                            <Tooltip key={dayInfo.dateStr}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={`p-3 rounded-lg border text-center cursor-default transition-colors ${
                                                            dayInfo.holiday
                                                                ? "bg-purple-100 dark:bg-purple-900/30 border-purple-300"
                                                                : dayInfo.isSun
                                                                ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300"
                                                                : dayInfo.isSat
                                                                ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300"
                                                                : "bg-background border-border"
                                                        }`}
                                                    >
                                                        <div className="text-sm font-medium mb-1">
                                                            {format(day, "d")}
                                                        </div>
                                                        <div className="flex justify-center">
                                                            {getStatusIcon(status, dayInfo.isNonWorkingDay)}
                                                        </div>
                                                        {dayInfo.holiday && (
                                                            <PartyPopper className="w-3 h-3 mx-auto mt-1 text-purple-600" />
                                                        )}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{format(day, "EEEE, MMMM d, yyyy")}</p>
                                                    {status && <p className="capitalize">Status: {status}</p>}
                                                    {dayInfo.holiday && (
                                                        <p className="text-purple-400 font-medium">
                                                            {dayInfo.holiday.name}
                                                        </p>
                                                    )}
                                                    {dayInfo.isWeekendDay && !dayInfo.holiday && (
                                                        <p className="text-yellow-400">Weekend - No Class</p>
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </TooltipProvider>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
