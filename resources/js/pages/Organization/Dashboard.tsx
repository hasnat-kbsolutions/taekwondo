import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GraduationCap,
    Landmark,
    Users,
    Group,
    DollarSign,
    BadgeCheck,
    Hourglass,
} from "lucide-react";



import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
export default function DashboardCards({
    studentsCount,
    branchesCount,
    paymentsCount,
    paidCount,
    pendingCount,
    totalAmount,
}: {
    studentsCount: number;
    branchesCount: number;
    paymentsCount: number;
    paidCount: number;
    pendingCount: number;
    totalAmount: number;
}) {
    const stats = [
        { label: "Students", count: studentsCount, icon: <GraduationCap /> },
        { label: "Branches", count: branchesCount, icon: <Landmark /> },
        { label: "Total Payments", count: paymentsCount, icon: <DollarSign /> },
        { label: "Paid", count: paidCount, icon: <BadgeCheck /> },
        { label: "Pending", count: pendingCount, icon: <Hourglass /> },
        {
            label: "Total Amount",
            count: `RM ${totalAmount.toFixed(2)}`,
            icon: <DollarSign />,
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
