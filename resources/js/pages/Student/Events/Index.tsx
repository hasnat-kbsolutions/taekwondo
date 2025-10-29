import React from "react";
import { Head, router, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

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
    events: Event[];
    filters: {
        status?: string;
        event_type?: string;
    };
}

export default function Index({ events, filters }: Props) {
    const handleFilterChange = ({
        status,
        event_type,
    }: {
        status?: string;
        event_type?: string;
    }) => {
        router.get(
            route("student.events.index"),
            { status, event_type },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const formatEventDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatEventTime = (timeStr?: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-500";
            case "ongoing":
                return "bg-green-500";
            case "completed":
                return "bg-gray-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Events" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Events
                    </h2>
                    <p className="text-muted-foreground">
                        View upcoming events at your dojang
                    </p>
                </div>

                <div className="flex gap-4">
                    <Select
                        value={filters.status || "upcoming"}
                        onValueChange={(value) =>
                            handleFilterChange({
                                status: value,
                                event_type: filters.event_type,
                            })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.event_type || "all"}
                        onValueChange={(value) =>
                            handleFilterChange({
                                status: filters.status,
                                event_type: value === "all" ? undefined : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="competition">
                                Competition
                            </SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {events.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">
                                No events found. Check back later!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Card
                                key={event.id}
                                className="hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-lg">
                                                    {event.title}
                                                </h3>
                                                <Badge variant="outline">
                                                    {event.event_type}
                                                </Badge>
                                            </div>
                                            <Badge
                                                className={getStatusColor(
                                                    event.status
                                                )}
                                            >
                                                {event.status}
                                            </Badge>
                                        </div>

                                        {event.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {event.description}
                                            </p>
                                        )}

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span>
                                                    {formatEventDate(
                                                        event.event_date
                                                    )}
                                                </span>
                                            </div>

                                            {event.start_time && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                    <span>
                                                        {formatEventTime(
                                                            event.start_time
                                                        )}
                                                        {event.end_time &&
                                                            ` - ${formatEventTime(
                                                                event.end_time
                                                            )}`}
                                                    </span>
                                                </div>
                                            )}

                                            {event.venue && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <span className="truncate">
                                                        {event.venue}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            asChild
                                            className="w-full"
                                            variant="outline"
                                        >
                                            <Link
                                                href={route(
                                                    "student.events.show",
                                                    event.id
                                                )}
                                            >
                                                View Details
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
