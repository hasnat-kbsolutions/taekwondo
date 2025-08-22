import React from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

type Attendance = {
    id: number;
    student_id: number;
    date: string;
    status: string;
    remarks?: string;
    student: Student;
};

type Props = {
    attendance: Attendance;
};

export default function Edit({ attendance }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        status: attendance.status,
        remarks: attendance.remarks || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("instructor.attendances.update", attendance.id));
    };

    return (
        <AuthenticatedLayout header="Edit Attendance">
            <Head title="Edit Attendance" />
            <div className="container mx-auto py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Attendance Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Student Information */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Student
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {attendance.student.name}{" "}
                                    {attendance.student.surname}
                                </p>
                            </div>

                            {/* Date Information */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Date
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(
                                        attendance.date
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Status Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData("status", value)
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
                                {errors.status && (
                                    <p className="text-sm text-red-500">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            {/* Remarks */}
                            <div className="space-y-2">
                                <Label htmlFor="remarks">
                                    Remarks (Optional)
                                </Label>
                                <Textarea
                                    id="remarks"
                                    placeholder="Add any notes..."
                                    value={data.remarks}
                                    onChange={(e) =>
                                        setData("remarks", e.target.value)
                                    }
                                    rows={3}
                                />
                                {errors.remarks && (
                                    <p className="text-sm text-red-500">
                                        {errors.remarks}
                                    </p>
                                )}
                            </div>

                            {/* Submit Buttons */}
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
                                        ? "Updating..."
                                        : "Update Attendance"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
