"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    date?: Date | string;
    onSelect: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePicker({
    date,
    onSelect,
    placeholder = "Pick a date",
    disabled,
    className,
}: DatePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        date instanceof Date ? date : date ? new Date(date) : undefined
    );

    React.useEffect(() => {
        setSelectedDate(
            date instanceof Date ? date : date ? new Date(date) : undefined
        );
    }, [date]);

    const handleSelect = (newDate: Date | undefined) => {
        setSelectedDate(newDate);
        onSelect(newDate);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        disabled && "cursor-not-allowed opacity-50",
                        className
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                        format(selectedDate, "PPP")
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
