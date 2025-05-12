import React from "react";
import { useForm, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Edit({ attendance }: any) {
    const { data, setData, put, processing, errors } = useForm({
        status: attendance.status || "present",
        remarks: attendance.remarks || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("attendances.update", attendance.id));
    };

    return (
        <AuthenticatedLayout header="Edit Attendance">
            <Head title="Edit Attendance" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Edit Attendance for {attendance.student?.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="excused">Excused</option>
                            </select>

                            <Input
                                placeholder="Remarks"
                                value={data.remarks}
                                onChange={(e) =>
                                    setData("remarks", e.target.value)
                                }
                            />

                            <Button type="submit" disabled={processing}>
                                Update
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
