import React, { useState } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 61 }, (_, i) => currentYear - 30 + i); // [currentYear -30, ..., currentYear +30]

interface Payment {
    id: number;
    amount: number;
    method: string;
    status: string;
    payment_month: string;
    pay_at: string;
    notes?: string;
}


interface Props {
    attendance: Record<string, "present" | "absent">;
    payments: Payment[];
    year: number;
}





export default function Payment({ attendance, year, payments }: Props) {
    const [selectedYear, setSelectedYear] = useState(year);

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newYear = parseInt(e.target.value);
        setSelectedYear(newYear);
        router.get(route("student.dashboard"), { year: newYear });
    };

    const getStatusIcon = (date: string) => {
        const status = attendance[date];
        if (status === "present") return "✅";
        if (status === "absent") return "❌";
        return "–";
    };

    return (
        <AuthenticatedLayout header="Yearly Attendance">
            <Head title="Student Attendance" />

            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Select Year
                    </label>
                    <select
                        value={selectedYear}
                        onChange={(e) =>
                            setSelectedYear(parseInt(e.target.value))
                        }
                        className="border px-3 py-2 rounded-md w-40"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-12">
                    <h2 className="text-lg font-semibold mb-4">
                        Payments for {selectedYear}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border border-collapse text-sm">
                            <thead>
                                <tr>
                                    <th className="border px-3 py-2 text-left">
                                        #
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                        Date
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                        Month
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                        Amount
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                        Method
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                        Status
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                        Notes
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="border px-3 py-4 text-center text-gray-500"
                                        >
                                            No payments found for this year.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment, index) => (
                                        <tr key={payment.id}>
                                            <td className="border px-3 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {payment.pay_at
                                                    ? format(
                                                          new Date(
                                                              payment.pay_at
                                                          ),
                                                          "yyyy-MM-dd"
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {payment.payment_month}
                                            </td>
                                            <td className="border px-3 py-2">
                                                Rs. {payment.amount}
                                            </td>
                                            <td className="border px-3 py-2 capitalize">
                                                {payment.method}
                                            </td>
                                            <td className="border px-3 py-2 capitalize">
                                                {payment.status}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {payment.notes || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
