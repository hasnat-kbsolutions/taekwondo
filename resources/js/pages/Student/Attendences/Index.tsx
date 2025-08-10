import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 31 }, (_, i) => currentYear - 15 + i); // [currentYear -15, ..., currentYear +15]

interface Props {
    attendance: Record<string, "present" | "absent">;
    year: number;
}

export default function Dashboard({ attendance, year }: Props) {
    const [selectedYear, setSelectedYear] = useState(year || currentYear);

    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);
        router.get(route("student.attendances.index"), { year: newYear });
    };

    const resetFilters = () => {
        setSelectedYear(currentYear);
        router.get(route("student.attendances.index"), { year: currentYear });
    };

    const getStatusIcon = (date: string) => {
        const status = attendance[date];
        if (status === "present") return "✅";
        if (status === "absent") return "❌";
        return "–";
    };

    return (
        <AuthenticatedLayout header="My Attendance">
            <Head title="My Attendance" />

            <div className="container mx-auto py-10 space-y-6">
                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 flex-wrap">
                            <div className="flex flex-col w-[180px]">
                                <Label className="text-sm mb-1">Year</Label>
                                <Select
                                    onValueChange={handleYearChange}
                                    value={selectedYear.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button onClick={resetFilters}>
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance for {selectedYear}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="table-auto border border-collapse w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="border px-2 py-1 text-left">
                                            Month
                                        </th>
                                        {[...Array(31)].map((_, i) => (
                                            <th
                                                key={i + 1}
                                                className="border px-2 py-1 text-center"
                                            >
                                                {i + 1}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(12)].map((_, monthIndex) => {
                                        const monthName = new Date(
                                            selectedYear,
                                            monthIndex
                                        ).toLocaleString("default", {
                                            month: "long",
                                        });

                                        return (
                                            <tr key={monthIndex}>
                                                <td className="border px-2 py-1 font-semibold">
                                                    {monthName}
                                                </td>
                                                {[...Array(31)].map(
                                                    (_, dayIndex) => {
                                                        const date = new Date(
                                                            selectedYear,
                                                            monthIndex,
                                                            dayIndex + 1
                                                        );
                                                        const formatted =
                                                            format(
                                                                date,
                                                                "yyyy-MM-dd"
                                                            );

                                                        const isValidDate =
                                                            date.getMonth() ===
                                                            monthIndex;

                                                        return (
                                                            <td
                                                                key={dayIndex}
                                                                className="border px-1 py-1 text-center"
                                                            >
                                                                {isValidDate
                                                                    ? getStatusIcon(
                                                                          formatted
                                                                      )
                                                                    : ""}
                                                            </td>
                                                        );
                                                    }
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
