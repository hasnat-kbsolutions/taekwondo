import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Student {
    id: number;
    name: string;
    club: {
        id: number;
        name: string;
    };
}

interface Club {
    id: number;
    name: string;
}

interface Props {
    clubs: Club[];
    students: Student[];
}

export default function Create({ clubs, students }: Props) {
    const [selectedClubId, setSelectedClubId] = useState<string>("");
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");

    const { data, setData, post, processing, errors } = useForm({
        club_id: "" as string | number,
        student_id: "" as string | number,
        file: null as File | null,
        issued_at: "",
        notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting form data:", data); // Debug
        post(route("organization.certifications.store"), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success
            },
        });
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    // Filter students based on selected club
    const filteredStudents = students.filter(
        (student) =>
            !selectedClubId || student.club.id.toString() === selectedClubId
    );

    // Keep form data in sync with local state
    useEffect(() => {
        if (selectedClubId) {
            setData("club_id", parseInt(selectedClubId));
        }
        if (selectedStudentId) {
            const selectedStudent = students.find(
                (student) => student.id.toString() === selectedStudentId
            );
            if (selectedStudent) {
                setData("club_id", selectedStudent.club.id);
                setData("student_id", selectedStudent.id);
            }
        }
    }, [selectedClubId, selectedStudentId, students, setData]);

    return (
        <AuthenticatedLayout header="Create Certification">
            <Head title="Create Certification" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Certification</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Assign a certification to a student. Fields marked
                            with * are required.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="club_id">
                                        Club{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedClubId}
                                        onValueChange={(value) => {
                                            console.log(
                                                "Selected club:",
                                                value
                                            ); // Debug
                                            setSelectedClubId(value);
                                            setSelectedStudentId(""); // Reset student selection
                                            setData("club_id", parseInt(value));
                                            setData("student_id", ""); // Reset student when club changes
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a club" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clubs.map((club) => (
                                                <SelectItem
                                                    key={club.id}
                                                    value={club.id.toString()}
                                                >
                                                    {club.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError("club_id")}
                                </div>

                                <div>
                                    <Label htmlFor="student_id">
                                        Student{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedStudentId}
                                        onValueChange={(value) => {
                                            console.log(
                                                "Selected student:",
                                                value
                                            ); // Debug
                                            setSelectedStudentId(value);
                                            setData(
                                                "student_id",
                                                parseInt(value)
                                            );
                                        }}
                                        disabled={!selectedClubId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredStudents.map((student) => (
                                                <SelectItem
                                                    key={student.id}
                                                    value={student.id.toString()}
                                                >
                                                    {student.name} -{" "}
                                                    {student.club.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError("student_id")}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="issued_at">
                                        Issued Date
                                    </Label>
                                    <Input
                                        id="issued_at"
                                        type="date"
                                        value={data.issued_at}
                                        onChange={(e) =>
                                            setData("issued_at", e.target.value)
                                        }
                                    />
                                    {renderError("issued_at")}
                                </div>

                                <div>
                                    <Label htmlFor="file">
                                        Certificate File{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                "file",
                                                e.target.files?.[0] || null
                                            )
                                        }
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        required
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Accepted formats: PDF, JPG, JPEG, PNG
                                        (max 10MB)
                                    </p>
                                    {renderError("file")}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    placeholder="Additional notes about this certification..."
                                    rows={4}
                                />
                                {renderError("notes")}
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Creating..."
                                        : "Create Certification"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
