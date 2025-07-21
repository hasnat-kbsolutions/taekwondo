import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Instructor {
    id: number;
    name: string;
    ic_number: string;
    email: string;
    address: string;
    mobile: string;
    grade: string;
    profile_picture: string | null;
}

interface Student {
    id: number;
    name: string;
    surname?: string;
}

interface Props {
    instructor: Instructor;
    students: Student[];
    selected_student_ids: number[];
}

export default function Edit({
    instructor,
    students,
    selected_student_ids,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put", // Spoof the PUT method
        name: instructor.name || "",
        ic_number: instructor.ic_number || "",
        email: instructor.email || "",
        address: instructor.address || "",
        mobile: instructor.mobile || "",
        grade: instructor.grade || "",
        profile_picture: null as File | null,
        student_ids: selected_student_ids
            ? Array.from(selected_student_ids)
            : [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("club.instructors.update", instructor.id));
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Edit Instructor">
            <Head title="Edit Instructor" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {renderError("name")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>IC Number</Label>
                                <Input
                                    value={data.ic_number}
                                    onChange={(e) =>
                                        setData("ic_number", e.target.value)
                                    }
                                />
                                {renderError("ic_number")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {renderError("email")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Address</Label>
                                <Input
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                />
                                {renderError("address")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Mobile</Label>
                                <Input
                                    value={data.mobile}
                                    onChange={(e) =>
                                        setData("mobile", e.target.value)
                                    }
                                />
                                {renderError("mobile")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Grade</Label>
                                <Input
                                    value={data.grade}
                                    onChange={(e) =>
                                        setData("grade", e.target.value)
                                    }
                                />
                                {renderError("grade")}
                            </div>

                            {/* Profile Picture */}
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Profile Picture</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            "profile_picture",
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                />
                                {renderError("profile_picture")}
                            </div>

                            {/* Students Checkbox List */}
                            <div className="w-full px-2 mt-3">
                                <Label>Assign Students</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border rounded p-2">
                                    {students.map((student) => (
                                        <label
                                            key={student.id}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={data.student_ids.includes(
                                                    student.id
                                                )}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData("student_ids", [
                                                            ...data.student_ids,
                                                            student.id,
                                                        ]);
                                                    } else {
                                                        setData(
                                                            "student_ids",
                                                            data.student_ids.filter(
                                                                (id) =>
                                                                    id !==
                                                                    student.id
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                            <span>
                                                {student.name}{" "}
                                                {student.surname || ""}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {renderError("student_ids")}
                            </div>

                            <div className="w-full px-2 mt-6">
                                <Button type="submit" disabled={processing}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
