"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
    value?: string;
    onChange: (time: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function TimePicker({
    value,
    onChange,
    placeholder = "Select time",
    disabled,
    className,
}: TimePickerProps) {
    const [selectedHour, setSelectedHour] = React.useState<string>(
        value ? value.split(":")[0] || "09" : "09"
    );
    const [selectedMinute, setSelectedMinute] = React.useState<string>(
        value ? value.split(":")[1] || "00" : "00"
    );
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (value) {
            const [hour, minute] = value.split(":");
            setSelectedHour(hour || "09");
            setSelectedMinute(minute || "00");
        }
    }, [value]);

    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    );
    const minutes = Array.from({ length: 12 }, (_, i) =>
        (i * 5).toString().padStart(2, "0")
    );

    const handleTimeChange = (hour: string, minute: string) => {
        setSelectedHour(hour);
        setSelectedMinute(minute);
        onChange(`${hour}:${minute}`);
    };

    const formatDisplayTime = (hour: string, minute: string) => {
        const hourNum = parseInt(hour);
        const displayHour = hourNum % 12 || 12;
        const ampm = hourNum >= 12 ? "PM" : "AM";
        return `${displayHour}:${minute} ${ampm}`;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                        !value && "text-muted-foreground"
                    }`}
                    disabled={disabled}
                >
                    <Clock className="mr-2 h-4 w-4" />
                    {value ? (
                        formatDisplayTime(selectedHour, selectedMinute)
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-sm font-medium">Select Time</p>
                        <p className="text-xs text-muted-foreground">
                            Choose hour and minute
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Hour Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Hour
                            </label>
                            <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto p-2 border rounded-md">
                                {hours.map((hour) => (
                                    <button
                                        key={hour}
                                        type="button"
                                        onClick={() =>
                                            handleTimeChange(
                                                hour,
                                                selectedMinute
                                            )
                                        }
                                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                                            selectedHour === hour
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-accent"
                                        }`}
                                    >
                                        {hour}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Minute Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Minute
                            </label>
                            <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto p-2 border rounded-md">
                                {minutes.map((minute) => (
                                    <button
                                        key={minute}
                                        type="button"
                                        onClick={() =>
                                            handleTimeChange(
                                                selectedHour,
                                                minute
                                            )
                                        }
                                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                                            selectedMinute === minute
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-accent"
                                        }`}
                                    >
                                        {minute}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={() => setOpen(false)}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
