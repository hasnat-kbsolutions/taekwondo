import React, { useState, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

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
    branches: SelectOption[];
    // organizations: SelectOption[];
    clubs: SelectOption[];
};

export default function Create({ branches, clubs }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        date: string;
        attendances: Attendances;
    }>({
        date: "",
        attendances: {},
    });

    const [students, setStudents] = useState<Student[]>([]);
    const [filters, setFilters] = useState({
        branch_id: "",
        // organization_id: "",
        club_id: "",
    });

    useEffect(() => {
        if (filters.branch_id && filters.club_id) {
            axios
                .get(route("organization.students.filter"), { params: filters })
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

        post(route("organization.attendances.store"), {
            onSuccess: () => {
                toast.success("Attendance submitted successfully!");
            },
            onError: (errors) => {
                toast.error("Failed to submit attendance.");
                console.error(errors); // Optional: log error details
            },
        });
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
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[50%] px-2">
                                <Label htmlFor="date">Date</Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!data.date}
                                            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {data.date ? (
                                                format(
                                                    new Date(data.date),
                                                    "PPP"
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                data.date
                                                    ? new Date(data.date)
                                                    : undefined
                                            }
                                            onSelect={(date) =>
                                                setData(
                                                    "date",
                                                    date
                                                        ? date
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : ""
                                                )
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="w-[50%] px-2">
                                <Label htmlFor="branch">Branch</Label>

                                <Select
                                    value={filters.branch_id}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            branch_id: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full p-2 border rounded-lg">
                                        <SelectValue placeholder="Select Branch" />
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
                            </div>

                            {/* <div className="w-[50%] px-2 mt-4">
                                <Label htmlFor="organization">
                                    Organization
                                </Label>

                                <Select
                                    value={filters.organization_id}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            organization_id: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full p-2 border rounded-lg">
                                        <SelectValue placeholder="Select Organization" />
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
                            </div> */}

                            <div className="w-[50%] px-2 mt-4">
                                <Label htmlFor="club">Club</Label>

                                <Select
                                    value={filters.club_id}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            club_id: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full p-2 border rounded-lg">
                                        <SelectValue placeholder="Select Club" />
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
                            </div>

                            {students.length > 0 && (
                                <div className="w-full mt-4 overflow-x-auto">
                                    <table className="w-full table-auto border border-gray-300">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="text-left px-4 py-2 border-b">
                                                    Name
                                                </th>
                                                <th className="text-left px-4 py-2 border-b">
                                                    Attendance
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student: any) => (
                                                <tr key={student.id}>
                                                    <td className="px-4 py-2 border-b">
                                                        {student.name}
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <div className="flex gap-6">
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`attendance-${student.id}`}
                                                                    value="present"
                                                                    checked={
                                                                        data
                                                                            .attendances[
                                                                            student
                                                                                .id
                                                                        ]
                                                                            ?.status ===
                                                                        "present"
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleAttendanceChange(
                                                                            student.id,
                                                                            "status",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <span>
                                                                    Present
                                                                </span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`attendance-${student.id}`}
                                                                    value="absent"
                                                                    checked={
                                                                        data
                                                                            .attendances[
                                                                            student
                                                                                .id
                                                                        ]
                                                                            ?.status ===
                                                                        "absent"
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleAttendanceChange(
                                                                            student.id,
                                                                            "status",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <span>
                                                                    Absent
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="w-[100%] px-2 mt-4">
                                <Button type="submit" disabled={processing}>
                                    Submit Attendance
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
