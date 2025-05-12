import React, { useState, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";

type AttendanceData = {
    [field: string]: string;
};

type Attendances = {
    [id: number]: AttendanceData;
};

type Student = {
    id: number;
    name: string;
};

type SelectOption = {
    id: number;
    name: string;
};

type Props = {
    companies: SelectOption[];
    organizations: SelectOption[];
    clubs: SelectOption[];
};

export default function Create({ companies, organizations, clubs }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        date: string;
        attendances: Attendances;
    }>({
        date: "",
        attendances: {},
    });

    const [students, setStudents] = useState<Student[]>([]);
    const [filters, setFilters] = useState({
        company_id: "",
        organization_id: "",
        club_id: "",
    });

    useEffect(() => {
        if (filters.company_id && filters.organization_id && filters.club_id) {
            axios
                .get(route("students.filter"), { params: filters })
                .then((res) => setStudents(res.data));
        }
    }, [filters]);

    const handleAttendanceChange = (
        id: number,
        field: string,
        value: string
    ) => {
        setData("attendances", {
            ...data.attendances,
            [id]: {
                ...data.attendances[id],
                [field]: value,
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("attendances.store"));
    };

    return (
        <AuthenticatedLayout header="Record Attendance">
            <Head title="Record Attendance" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>New Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData("date", e.target.value)
                                }
                            />

                            <select
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        company_id: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Company</option>
                                {companies.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        organization_id: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Organization</option>
                                {organizations.map((o: any) => (
                                    <option key={o.id} value={o.id}>
                                        {o.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        club_id: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Club</option>
                                {clubs.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            {students.length > 0 && (
                                <table className="w-full border mt-4">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student: any) => (
                                            <tr key={student.id}>
                                                <td>{student.name}</td>
                                                <td>
                                                    <select
                                                        onChange={(e) =>
                                                            handleAttendanceChange(
                                                                student.id,
                                                                "status",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="present">
                                                            Present
                                                        </option>
                                                        <option value="absent">
                                                            Absent
                                                        </option>
                                                        <option value="late">
                                                            Late
                                                        </option>
                                                        <option value="excused">
                                                            Excused
                                                        </option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <Input
                                                        type="text"
                                                        onChange={(e) =>
                                                            handleAttendanceChange(
                                                                student.id,
                                                                "remarks",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Remarks"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            <Button type="submit" disabled={processing}>
                                Submit Attendance
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
