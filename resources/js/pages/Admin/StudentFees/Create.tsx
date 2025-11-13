import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Student {
    id: number;
    name: string;
    surname?: string;
}

interface FeeType {
    id: number;
    name: string;
    default_amount: number | null;
}

interface Props {
    students: Student[];
    feeTypes: FeeType[];
}

// Generate months for the year/month selector
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

export default function Create({ students = [], feeTypes = [] }: Props) {
    // Use local state for Select components to ensure they work
    const [selectedStudentId, setSelectedStudentId] =
        React.useState<string>("");
    const [selectedFeeTypeId, setSelectedFeeTypeId] =
        React.useState<string>("");

    const { data, setData, post, processing, errors } = useForm({
        student_id: "",
        fee_type_id: "",
        month: "",
        amount: "",
        discount: "0",
        fine: "0",
        due_date: "",
    });

    // Parse month value (YYYY-MM format)
    const [selectedYear, setSelectedYear] = React.useState<string>(
        data.month ? data.month.split("-")[0] : String(currentYear)
    );
    const [selectedMonth, setSelectedMonth] = React.useState<string>(
        data.month ? data.month.split("-")[1] : ""
    );
    const [selectedDueDate, setSelectedDueDate] = React.useState<
        Date | undefined
    >(data.due_date ? new Date(data.due_date) : undefined);

    // Sync local state with form data
    React.useEffect(() => {
        if (selectedStudentId) {
            setData("student_id", selectedStudentId);
        }
    }, [selectedStudentId]);

    React.useEffect(() => {
        if (selectedFeeTypeId) {
            console.log("Syncing fee_type_id to form:", selectedFeeTypeId);
            setData("fee_type_id", selectedFeeTypeId);
            // Auto-fill amount if fee type has default amount
            const feeTypeId = parseInt(selectedFeeTypeId, 10);
            if (!isNaN(feeTypeId)) {
                const feeType = feeTypes.find((ft) => ft.id === feeTypeId);
                if (feeType?.default_amount) {
                    setData("amount", feeType.default_amount.toString());
                }
            }
        }
    }, [selectedFeeTypeId]);

    // Update form month when year or month changes
    React.useEffect(() => {
        if (selectedYear && selectedMonth) {
            const monthValue = `${selectedYear}-${selectedMonth.padStart(
                2,
                "0"
            )}`;
            setData("month", monthValue);
        }
    }, [selectedYear, selectedMonth]);

    // Update form due_date when calendar date changes
    React.useEffect(() => {
        if (selectedDueDate) {
            setData("due_date", format(selectedDueDate, "yyyy-MM-dd"));
        }
    }, [selectedDueDate]);

    const handleFeeTypeChange = (value: string) => {
        console.log("Fee type selected:", value);
        setSelectedFeeTypeId(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(
            "Submitting with fee_type_id:",
            data.fee_type_id,
            "selectedFeeTypeId:",
            selectedFeeTypeId
        );

        // Use the local state value if form data is empty
        const finalFeeTypeId = data.fee_type_id || selectedFeeTypeId;
        const finalStudentId = data.student_id || selectedStudentId;

        if (!finalFeeTypeId || finalFeeTypeId === "") {
            alert("Please select a fee type");
            return;
        }

        if (!finalStudentId || finalStudentId === "") {
            alert("Please select a student");
            return;
        }

        // Prepare the form data with all values
        const formData = {
            student_id: finalStudentId,
            fee_type_id: finalFeeTypeId,
            month: data.month,
            amount: data.amount,
            discount: data.discount,
            fine: data.fine,
            due_date: data.due_date,
        };

        console.log("Final form data:", formData);

        // Submit directly using router.post to ensure all data is sent
        router.post(route("admin.student-fees.store"), formData);
    };

    return (
        <AuthenticatedLayout header="Create Student Fee">
            <Head title="Create Student Fee" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Student Fee</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>
                                        Student{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedStudentId}
                                        onValueChange={setSelectedStudentId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students && students.length > 0 ? (
                                                students.map((student) => (
                                                    <SelectItem
                                                        key={student.id}
                                                        value={String(
                                                            student.id
                                                        )}
                                                    >
                                                        {student.name}{" "}
                                                        {student.surname || ""}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    No students available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.student_id && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.student_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>
                                        Fee Type{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedFeeTypeId}
                                        onValueChange={handleFeeTypeChange}
                                        disabled={
                                            !feeTypes || feeTypes.length === 0
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Fee Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {feeTypes && feeTypes.length > 0 ? (
                                                feeTypes.map((feeType) => (
                                                    <SelectItem
                                                        key={feeType.id}
                                                        value={String(
                                                            feeType.id
                                                        )}
                                                    >
                                                        {feeType.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    No fee types available.
                                                    Please create fee types
                                                    first.
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>

                                    {errors.fee_type_id && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.fee_type_id}
                                        </p>
                                    )}
                                    {(!feeTypes || feeTypes.length === 0) && (
                                        <p className="text-yellow-600 text-sm mt-1">
                                            No fee types found. Please create
                                            fee types first from{" "}
                                            <a
                                                href={route(
                                                    "admin.fee-types.create"
                                                )}
                                                className="underline"
                                            >
                                                Fee Types
                                            </a>
                                            .
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>
                                        Month (YYYY-MM){" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Select
                                            value={selectedYear}
                                            onValueChange={setSelectedYear}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={String(year)}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={selectedMonth}
                                            onValueChange={setSelectedMonth}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((month, index) => (
                                                    <SelectItem
                                                        key={month}
                                                        value={String(
                                                            index + 1
                                                        ).padStart(2, "0")}
                                                    >
                                                        {month}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors.month && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.month}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>
                                        Amount{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData("amount", e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                    {errors.amount && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Discount</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.discount}
                                        onChange={(e) =>
                                            setData("discount", e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                    {errors.discount && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.discount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Fine</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.fine}
                                        onChange={(e) =>
                                            setData("fine", e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                    {errors.fine && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.fine}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Due Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !selectedDueDate &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {selectedDueDate ? (
                                                    format(
                                                        selectedDueDate,
                                                        "PPP"
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDueDate}
                                                onSelect={setSelectedDueDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.due_date && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.due_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Create Student Fee
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
