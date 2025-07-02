import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, DollarSign, BadgeCheck, Hourglass } from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";

interface Props {
    studentsCount: number;
    paymentsCount: number;
    paidCount: number;
    pendingCount: number;
    totalAmount: number;
}

export default function DashboardCards({
    studentsCount,
    paymentsCount,
    paidCount,
    pendingCount,
    totalAmount,
}: Props) {
    const stats = [
        {
            label: "Students",
            count: studentsCount,
            icon: <GraduationCap className="h-6 w-6 text-primary" />,
        },
        {
            label: "Total Payments",
            count: paymentsCount,
            icon: <DollarSign className="h-6 w-6 text-primary" />,
        },
        {
            label: "Paid",
            count: paidCount,
            icon: <BadgeCheck className="h-6 w-6 text-green-600" />,
        },
        {
            label: "Pending",
            count: pendingCount,
            icon: <Hourglass className="h-6 w-6 text-yellow-500" />,
        },
        {
            label: "Total Amount",
            count: `RM ${totalAmount.toFixed(2)}`,
            icon: <DollarSign className="h-6 w-6 text-primary" />,
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
