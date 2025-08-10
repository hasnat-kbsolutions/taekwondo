import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit } from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Props {
    students: {
        id: number;
        name: string;
        surname: string;
        email: string;
        grade: string;
        status: boolean;
    }[];
}

export default function Index({ students }: Props) {
    return (
        <AuthenticatedLayout header="Students">
            <Head title="Students" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Grade
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, idx) => (
                                    <tr key={student.id} className="border-b">
                                        <td className="px-4 py-2">{idx + 1}</td>
                                        <td className="px-4 py-2">
                                            {student.name} {student.surname}
                                        </td>
                                        <td className="px-4 py-2">
                                            {student.email}
                                        </td>
                                        <td className="px-4 py-2">
                                            {student.grade}
                                        </td>
                                        <td className="px-4 py-2">
                                            {student.status
                                                ? "Active"
                                                : "Inactive"}
                                        </td>
                                        <td className="px-4 py-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route(
                                                                "instructor.students.edit",
                                                                student.id
                                                            )}
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />{" "}
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
