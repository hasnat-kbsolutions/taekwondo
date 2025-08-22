import React, { useState } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Student = {
    id: number;
    name: string;
    surname: string;
};

type Props = {
    students: Student[];
};

export default function Create({ students }: Props) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const { data, setData, post, processing, errors } = useForm({
        date: selectedDate,
        attendances: {} as Record<string, { status: string; remarks?: string }>,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("instructor.attendances.store"));
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setData("date", date);
    };

    const handleAttendanceChange = (
        studentId: string,
        field: string,
        value: string
    ) => {
        setData("attendances", {
            ...data.attendances,
            [studentId]: {
                ...data.attendances[studentId],
                [field]: value,
            },
        });
    };

    return (
        <AuthenticatedLayout header="Create Attendance">
            <Head title="Create Attendance" />
            <div className="container mx-auto py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Attendance Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Date Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) =>
                                        handleDateChange(e.target.value)
                                    }
                                    required
                                />
                                {errors.date && (
                                    <p className="text-sm text-red-500">
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            {/* Students Attendance */}
                            <div className="space-y-4">
                                <Label>Student Attendance</Label>
                                {students.map((student) => (
                                    <Card key={student.id}>
                                        <CardContent className="pt-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Student
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {student.name}{" "}
                                                        {student.surname}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor={`status-${student.id}`}
                                                    >
                                                        Status
                                                    </Label>
                                                    <Select
                                                        value={
                                                            data.attendances[
                                                                student.id
                                                            ]?.status || ""
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handleAttendanceChange(
                                                                student.id.toString(),
                                                                "status",
                                                                value
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="present">
                                                                Present
                                                            </SelectItem>
                                                            <SelectItem value="absent">
                                                                Absent
                                                            </SelectItem>
                                                            <SelectItem value="late">
                                                                Late
                                                            </SelectItem>
                                                            <SelectItem value="excused">
                                                                Excused
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor={`remarks-${student.id}`}
                                                    >
                                                        Remarks (Optional)
                                                    </Label>
                                                    <Textarea
                                                        id={`remarks-${student.id}`}
                                                        placeholder="Add any notes..."
                                                        value={
                                                            data.attendances[
                                                                student.id
                                                            ]?.remarks || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleAttendanceChange(
                                                                student.id.toString(),
                                                                "remarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary text-background"
                                >
                                    {processing
                                        ? "Creating..."
                                        : "Create Attendance"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
