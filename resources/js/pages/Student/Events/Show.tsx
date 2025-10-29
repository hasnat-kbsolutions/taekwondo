import React from "react";
import { Head, router, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, ArrowLeft, Globe } from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface Club {
    id: number;
    name: string;
}

interface Organization {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

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
    club?: Club;
    organization?: Organization;
    creator?: User;
}

interface Props {
    event: Event;
}

export default function Show({ event }: Props) {
    const formatEventDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
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
            <Head title={event.title} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            router.visit(route("student.events.index"))
                        }
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {event.title}
                        </h2>
                        <p className="text-muted-foreground">
                            {event.club?.name}
                        </p>
                    </div>
                </div>

                {/* Event Header with Hero Section */}
                {event.image && (
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <img
                                src={`/storage/${event.image}`}
                                alt={event.title}
                                className="w-full h-96 object-cover"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Key Information Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-8 h-8 text-blue-600 mt-1" />
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Date
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {formatEventDate(event.event_date)}
                                    </p>
                                    {event.start_time && (
                                        <p className="text-sm text-blue-600">
                                            {formatEventTime(event.start_time)}
                                            {event.end_time &&
                                                ` - ${formatEventTime(
                                                    event.end_time
                                                )}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {event.venue && (
                        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-8 h-8 text-green-600 mt-1" />
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <p className="text-sm text-muted-foreground">
                                            Venue
                                        </p>
                                        <p className="text-lg font-semibold line-clamp-2">
                                            {event.venue}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Globe className="w-8 h-8 text-purple-600 mt-1" />
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Event Type
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="text-base py-1"
                                    >
                                        {event.event_type}
                                    </Badge>
                                    <Badge
                                        className={`mt-2 ${getStatusColor(
                                            event.status
                                        )}`}
                                    >
                                        {event.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Description and Additional Info */}
                {event.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                About This Event
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                {event.description}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Additional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Event Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Organized By
                                </p>
                                <p className="text-base font-semibold">
                                    {event.club?.name}
                                </p>
                            </div>

                            {event.organization && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Organization
                                    </p>
                                    <p className="text-base font-semibold">
                                        {event.organization.name}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Event Type
                                </p>
                                <Badge variant="outline">
                                    {event.event_type}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Visibility
                                </p>
                                <p className="text-base">
                                    {event.is_public ? (
                                        <span className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-green-600" />
                                            Public Event
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-red-500"></span>
                                            Private Event
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
