import React from "react";
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
        organization: {
            id: number;
            name: string;
        };
    };
}

interface Certification {
    id: number;
    student_id: number;
    student: Student;
    issued_at: string | null;
    notes: string | null;
    file: string | null;
}

interface Props {
    certification: Certification;
    students: Student[];
}

export default function Edit({ certification, students }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: certification.student_id || "",
        issued_at: certification.issued_at
            ? new Date(certification.issued_at).toISOString().split("T")[0]
            : "",
        notes: certification.notes || "",
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(
            route("admin.certifications.update", {
                certification: certification.id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Handle success
                },
            }
        );
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Edit Certification">
            <Head title="Edit Certification" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Certification</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Update certification details for student.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="student_id">
                                        Student{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.student_id.toString()}
                                        onValueChange={(value) =>
                                            setData(
                                                "student_id",
                                                parseInt(value)
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem
                                                    key={student.id}
                                                    value={student.id.toString()}
                                                >
                                                    {student.name} -{" "}
                                                    {student.club.name} (
                                                    {
                                                        student.club
                                                            .organization.name
                                                    }
                                                    )
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError("student_id")}
                                </div>

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
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes || ""}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    placeholder="Additional notes about this certification..."
                                    rows={4}
                                />
                                {renderError("notes")}
                            </div>

                            <div>
                                <Label htmlFor="file">Certificate File</Label>
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
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Leave empty to keep the current file.
                                    Accepted formats: PDF, JPG, JPEG, PNG (max
                                    10MB)
                                </p>
                                {certification.file && (
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground">
                                            Current file:
                                        </p>
                                        <a
                                            href={`/storage/${certification.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            View current certificate file
                                        </a>
                                    </div>
                                )}
                                {renderError("file")}
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Updating..."
                                        : "Update Certification"}
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
