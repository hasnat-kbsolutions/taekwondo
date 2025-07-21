import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

export default function Dashboard({
    studentsCount,
}: {
    studentsCount: number;
}) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Students
                        </CardTitle>
                        <GraduationCap className="h-6 w-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {studentsCount}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
