"use client";

import React, { useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Checkbox } from "@/components/ui/checkbox";

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
}

interface Student {
    id: number;
    name: string;
    surname?: string;
}

interface Props {
    organizations: Organization[];
    clubs: Club[];
    students: Student[];
    selected_organization_id?: number;
    selected_club_id?: number;
}

export default function Create({
    organizations,
    clubs,
    students,
    selected_organization_id,
    selected_club_id,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        ic_number: "",
        email: "",
        address: "",
        mobile: "",
        grade: "",
        gender: "",
        profile_picture: null as File | null,
        organization_id: selected_organization_id
            ? String(selected_organization_id)
            : "",
        club_id: selected_club_id ? String(selected_club_id) : "",
        student_ids: [] as number[],
        password: "",
    });

    useEffect(() => {
        if (data.organization_id && data.club_id) {
            router.visit(route("admin.instructors.create"), {
                data: {
                    organization_id: data.organization_id,
                    club_id: data.club_id,
                },
                preserveState: true,
                replace: true,
            });
        }
        // eslint-disable-next-line
    }, [data.organization_id, data.club_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.instructors.store"), {
            forceFormData: true,
        });
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Create Instructor">
            <Head title="Create Instructor" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Instructor</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Fields marked with * are required.
                        </p>
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

                            <div className="w-[25%] px-2 mt-3">
                                <Label>Gender</Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) =>
                                        setData("gender", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {renderError("gender")}
                            </div>

                            {/* Organization Select */}
                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Organization{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.organization_id}
                                    onValueChange={(value) =>
                                        setData("organization_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem
                                                key={org.id}
                                                value={String(org.id)}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {renderError("organization_id")}
                            </div>

                            {/* Club Select */}
                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Club
                                    <span className="text-red-500">*</span>
                                </Label>

                                <Select
                                    value={data.club_id}
                                    onValueChange={(value) =>
                                        setData("club_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Club" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clubs.map((club) => (
                                            <SelectItem
                                                key={club.id}
                                                value={String(club.id)}
                                            >
                                                {club.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {renderError("club_id")}
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

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Password{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {renderError("password")}
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
