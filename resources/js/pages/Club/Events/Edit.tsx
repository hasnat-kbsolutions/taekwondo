import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { ArrowLeft } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Event {
    id: number;
    title: string;
    description?: string;
    event_type: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    venue?: string;
    status: string;
    is_public: boolean;
    image?: string;
}

interface Props {
    event: Event;
}

export default function Edit({ event }: Props) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        event.event_date ? new Date(event.event_date) : undefined
    );

    const { data, setData, put, processing, errors } = useForm({
        title: event.title || "",
        description: event.description || "",
        event_type: event.event_type || "training",
        event_date: event.event_date || "",
        start_time: event.start_time || "",
        end_time: event.end_time || "",
        venue: event.venue || "",
        status: event.status || "upcoming",
        is_public: event.is_public !== undefined ? event.is_public : true,
        image: null as File | null,
    });

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            setData("event_date", date.toISOString().split("T")[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("club.events.update", event.id), {
            onSuccess: () => {
                router.visit(route("club.events.index"));
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Event" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.visit(route("club.events.index"))}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Edit Event
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Update the basic details of your event
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="e.g., Summer Training Camp"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Event description..."
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="event_type">
                                        Event Type *
                                    </Label>
                                    <Select
                                        value={data.event_type}
                                        onValueChange={(value) =>
                                            setData("event_type", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="training">
                                                Training
                                            </SelectItem>
                                            <SelectItem value="competition">
                                                Competition
                                            </SelectItem>
                                            <SelectItem value="seminar">
                                                Seminar
                                            </SelectItem>
                                            <SelectItem value="meeting">
                                                Meeting
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.event_type && (
                                        <p className="text-sm text-red-600">
                                            {errors.event_type}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData("status", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upcoming">
                                                Upcoming
                                            </SelectItem>
                                            <SelectItem value="ongoing">
                                                Ongoing
                                            </SelectItem>
                                            <SelectItem value="completed">
                                                Completed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-600">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Date & Time</CardTitle>
                                <CardDescription>
                                    Update event schedule
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="event_date">Date *</Label>
                                    <DatePicker
                                        date={selectedDate}
                                        onSelect={handleDateChange}
                                        placeholder="Select event date"
                                    />
                                    {errors.event_date && (
                                        <p className="text-sm text-red-600">
                                            {errors.event_date}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">
                                            Start Time
                                        </Label>
                                        <TimePicker
                                            value={data.start_time}
                                            onChange={(time) =>
                                                setData("start_time", time)
                                            }
                                            placeholder="Select start time"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">
                                            End Time
                                        </Label>
                                        <TimePicker
                                            value={data.end_time}
                                            onChange={(time) =>
                                                setData("end_time", time)
                                            }
                                            placeholder="Select end time"
                                        />
                                    </div>
                                </div>

                                {errors.start_time && (
                                    <p className="text-sm text-red-600">
                                        {errors.start_time}
                                    </p>
                                )}
                                {errors.end_time && (
                                    <p className="text-sm text-red-600">
                                        {errors.end_time}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                            <CardDescription>
                                Where will the event take place?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="venue">Venue</Label>
                                <Input
                                    id="venue"
                                    value={data.venue}
                                    onChange={(e) =>
                                        setData("venue", e.target.value)
                                    }
                                    placeholder="e.g., Main Dojang"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="is_public"
                                    type="checkbox"
                                    checked={data.is_public}
                                    onChange={(e) =>
                                        setData("is_public", e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label
                                    htmlFor="is_public"
                                    className="!m-0 cursor-pointer"
                                >
                                    Public Event
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.visit(route("club.events.index"))
                            }
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Updating..." : "Update Event"}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
