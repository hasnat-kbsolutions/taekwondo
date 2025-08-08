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
}

interface Props {
    students: Student[];
}

export default function Create({ students }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: "",
        file: null as File | null,
        issued_at: "",
        notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("club.certifications.store"), {
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
                                    <Label htmlFor="student_id">
                                        Student{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.student_id || ""}
                                        onValueChange={(value) =>
                                            setData("student_id", value)
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
                                                    {student.name}
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
                                    Accepted formats: PDF, JPG, JPEG, PNG (max
                                    10MB)
                                </p>
                                {renderError("file")}
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
