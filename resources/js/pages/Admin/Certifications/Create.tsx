import React, { useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";

interface Organization {
    id: number;
    name: string;
}
interface Club {
    id: number;
    name: string;
    organization_id: number;
}
interface Student {
    id: number;
    name: string;
    club_id: number;
    organization_id: number;
}
interface Props {
    organizations: Organization[];
    clubs: Club[];
    students: Student[];
}

export default function Create({ organizations, clubs, students }: Props) {
    const safeOrganizations: Organization[] = organizations ?? [];
    const safeClubs: Club[] = clubs ?? [];
    const safeStudents: Student[] = students ?? [];

    const { data, setData, post, processing, errors } = useForm<{
        organization_id: string;
        club_id: string;
        student_id: string;
        file: File | null;
        issued_at: string;
        notes: string;
    }>({
        organization_id: "",
        club_id: "",
        student_id: "",
        file: null,
        issued_at: "",
        notes: "",
    });

    // Filter clubs by selected organization
    const filteredClubs = useMemo(() => {
        const clubs = safeClubs.filter(
            (club) =>
                String(club.organization_id) === String(data.organization_id)
        );
        console.log("Filtered Clubs:", clubs); // Debugging
        return clubs;
    }, [safeClubs, data.organization_id]);

    // Filter students by selected club
    const filteredStudents = useMemo(() => {
        const students = safeStudents.filter(
            (student) => String(student.club_id) === String(data.club_id)
        );
        console.log("Filtered Students:", students); // Debugging
        return students;
    }, [safeStudents, data.club_id]);

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData("file", file);
    };

    // Render error messages
    const renderError = (field: keyof typeof errors) => {
        return errors[field] ? (
            <div className="text-red-500 text-xs mt-1">{errors[field]}</div>
        ) : null;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/certificates");
    };

    return (
        <AuthenticatedLayout header="Create Ahli Gabungan">
            <Head title="Create Organization" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Assign Certificate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Organization{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.organization_id}
                                    onValueChange={(value) => {
                                        setData({
                                            ...data,
                                            organization_id: value,
                                            club_id: "",
                                            student_id: "",
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {safeOrganizations.map((org) => (
                                            <SelectItem
                                                key={org.id}
                                                value={org.id.toString()}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {renderError("organization_id")}
                            </div>

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Club <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.club_id}
                                    onValueChange={(value) => {
                                        setData({
                                            ...data,
                                            club_id: value,
                                            student_id: "",
                                        });
                                    }}
                                    disabled={
                                        !data.organization_id ||
                                        filteredClubs.length === 0
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Club" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredClubs.map((club) => (
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

                            <div className="w-[25%] px-2 mt-3">
                                <Label>
                                    Student{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.student_id}
                                    onValueChange={(value) =>
                                        setData("student_id", value)
                                    }
                                    disabled={
                                        !data.club_id ||
                                        filteredStudents.length === 0
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredStudents.map((student) => (
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
                            <div className="w-[25%] px-2 mt-3">
                                <Label htmlFor="issued_at">Issued At</Label>
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
                            <div className="w-[50%] px-2 mt-3">
                                <Label htmlFor="file">
                                    Certificate File{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={handleFileChange}
                                />
                                {renderError("file")}
                            </div>

                            <div className="w-full px-2 mt-3">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={4} // Optional: adjust as needed
                                    placeholder="Enter notes here"
                                />
                                {renderError("notes")}
                            </div>

                            <div className="w-full px-2 mt-6">
                                <Button type="submit" disabled={processing}>
                                    Assign Certificate
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
