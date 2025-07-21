import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountryDropdown } from "@/components/ui/country-dropdown";

interface Student {
    id: number;
    name: string;
    surname?: string;
    email?: string;
    phone?: string;
    grade?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
    country?: string;
    status?: boolean;
}

interface Props {
    student: Student;
}

export default function Edit({ student }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: student.name || "",
        surname: student.surname || "",
        email: student.email || "",
        phone: student.phone || "",
        grade: student.grade || "",
        dob: student.dob || "",
        gender: student.gender || "",
        nationality: student.nationality || "",
        country: student.country || "",
        status: student.status ? true : false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("instructor.students.update", student.id));
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Edit Student">
            <Head title="Edit Student" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Student</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {renderError("name")}
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Surname</Label>
                                <Input
                                    value={data.surname}
                                    onChange={(e) =>
                                        setData("surname", e.target.value)
                                    }
                                />
                                {renderError("surname")}
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Email</Label>
                                <Input
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {renderError("email")}
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Phone</Label>
                                <Input
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                />
                                {renderError("phone")}
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
                                <Label>Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={data.dob}
                                    onChange={(e) =>
                                        setData("dob", e.target.value)
                                    }
                                />
                                {renderError("dob")}
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Gender</Label>
                                <Input
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                />
                                {renderError("gender")}
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Nationality</Label>
                                <CountryDropdown
                                    placeholder="Select Nationality"
                                    defaultValue={data.nationality}
                                    onChange={(c) =>
                                        setData("nationality", c?.alpha3 || "")
                                    }
                                    slim={false}
                                />
                                {renderError("nationality")}
                            </div>
                            <div className="w-[25%] px-2 mt-3">
                                <Label>Country</Label>
                                <CountryDropdown
                                    placeholder="Select Country"
                                    defaultValue={data.country}
                                    onChange={(c) =>
                                        setData("country", c?.alpha3 || "")
                                    }
                                    slim={false}
                                />
                                {renderError("country")}
                            </div>
                            <div className="w-[25%] px-2 mt-3 flex items-center">
                                <Label>Status</Label>
                                <input
                                    type="checkbox"
                                    checked={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.checked)
                                    }
                                    className="ml-2"
                                />
                                {renderError("status")}
                            </div>
                            <div className="w-full px-2 mt-6">
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
