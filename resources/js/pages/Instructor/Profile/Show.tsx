import React from "react";
import { Head } from "@inertiajs/react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Instructor {
    id: number;
    name: string;
    email: string;
    mobile: string;
    grade: string;
    gender: string;
    address: string;
    ic_number: string;
    profile_picture: string | null;
    club: { id: number; name: string } | null;
    organization: { id: number; name: string } | null;
}

interface Props {
    instructor: Instructor;
    stats: {
        students_count: number;
    };
}

const InstructorProfile: React.FC<Props> = ({
    instructor,
    stats,
}) => {

    return (
        <AuthenticatedLayout header="My Profile">
            <Head title="My Profile" />
            <div className="container mx-auto py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Name
                                        </Label>
                                        <p className="text-lg font-semibold">
                                            {instructor.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.email}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Mobile
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.mobile}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Grade
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.grade}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Gender
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.gender
                                                ? instructor.gender
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  instructor.gender.slice(1)
                                                : "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            IC Number
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.ic_number}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Address
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.address}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Club
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.club?.name ||
                                                "Not assigned"}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Organization
                                        </Label>
                                        <p className="text-lg">
                                            {instructor.organization?.name ||
                                                "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span>Students</span>
                                        </div>
                                        <span className="font-semibold">
                                            {stats.students_count}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>




                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default InstructorProfile;
