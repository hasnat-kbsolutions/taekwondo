import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Building, Users, Group } from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
export default function DashboardCards({
    studentsCount,
    organizationsCount,
    branchesCount,
    clubsCount,
    SupportersCount,
}: {
    studentsCount: number;
    organizationsCount: number;
    branchesCount: number;
    clubsCount: number;
    SupportersCount: number;
}) {
    const stats = [
        {
            label: "Students",
            count: studentsCount,
            icon: <GraduationCap className="h-6 w-6 text-primary" />,
        },
        {
            label: "Organizations",
            count: organizationsCount,
            icon: <Users className="h-6 w-6 text-primary" />,
        },
        {
            label: "Branches",
            count: branchesCount,
            icon: <Building className="h-6 w-6 text-primary" />,
        },
        {
            label: "Clubs",
            count: clubsCount,
            icon: <Group className="h-6 w-6 text-primary" />,
        },
        {
            label: "Supporters",
            count: SupportersCount,
            icon: <Users className="h-6 w-6 text-primary" />,
        },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((item) => (
                    <Card key={item.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.label}
                            </CardTitle>
                            {item.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {item.count}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
