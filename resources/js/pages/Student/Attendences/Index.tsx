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
    year: number;
}





export default function Dashboard({ attendance, year }: Props) {
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
           
                           <div className="overflow-x-auto">
                               <table className="table-auto border border-collapse w-full text-sm">
                                   <thead>
                                       <tr>
                                           <th className="border px-2 py-1 text-left">
                                               Month
                                           </th>
                                           {[...Array(31)].map((_, i) => (
                                               <th
                                                   key={i + 1}
                                                   className="border px-2 py-1 text-center"
                                               >
                                                   {i + 1}
                                               </th>
                                           ))}
                                       </tr>
                                   </thead>
                                   <tbody>
                                       {[...Array(12)].map((_, monthIndex) => {
                                           const monthName = new Date(
                                               selectedYear,
                                               monthIndex
                                           ).toLocaleString("default", { month: "long" });
           
                                           return (
                                               <tr key={monthIndex}>
                                                   <td className="border px-2 py-1 font-semibold">
                                                       {monthName}
                                                   </td>
                                                   {[...Array(31)].map((_, dayIndex) => {
                                                       const date = new Date(
                                                           selectedYear,
                                                           monthIndex,
                                                           dayIndex + 1
                                                       );
                                                       const formatted = format(
                                                           date,
                                                           "yyyy-MM-dd"
                                                       );
           
                                                       const isValidDate =
                                                           date.getMonth() === monthIndex;
           
                                                       return (
                                                           <td
                                                               key={dayIndex}
                                                               className="border px-1 py-1 text-center"
                                                           >
                                                               {isValidDate
                                                                   ? getStatusIcon(
                                                                         formatted
                                                                     )
                                                                   : ""}
                                                           </td>
                                                       );
                                                   })}
                                               </tr>
                                           );
                                       })}
                                   </tbody>
                               </table>
                           </div>


           
            </div>
        </AuthenticatedLayout>
    );
}
