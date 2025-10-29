import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Plus,
    Calendar,
    MapPin,
    Clock,
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    creator?: User;
}

interface Props {
    events: Event[];
    filters: {
        status?: string;
        event_type?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function Index({ events, filters }: Props) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const openDeleteDialog = (event: Event) => {
        setSelectedEvent(event);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedEvent) {
            router.delete(route("club.events.destroy", selectedEvent.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedEvent(null);
                },
            });
        }
    };

    const handleFilterChange = ({
        status,
        event_type,
    }: {
        status?: string;
        event_type?: string;
    }) => {
        router.get(
            route("club.events.index"),
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

    const columns: ColumnDef<Event>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="font-medium">{row.original.title}</div>
            ),
        },
        {
            accessorKey: "event_type",
            header: "Type",
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.event_type}</Badge>
            ),
        },
        {
            header: "Date",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formatEventDate(row.original.event_date)}
                </div>
            ),
        },
        {
            header: "Time",
            cell: ({ row }) => {
                if (row.original.start_time) {
                    return (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {formatEventTime(row.original.start_time)}
                        </div>
                    );
                }
                return "-";
            },
        },
        {
            header: "Location",
            cell: ({ row }) => {
                if (row.original.venue) {
                    return (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">
                                {row.original.venue}
                            </span>
                        </div>
                    );
                }
                return "-";
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge className={getStatusColor(row.original.status)}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "club.events.edit",
                                    row.original.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => openDeleteDialog(row.original)}
                            className="text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Events" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Events
                    </h2>
                    <Button asChild>
                        <Link href={route("club.events.create")}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Event
                        </Link>
                    </Button>
                </div>

                <div className="flex gap-4">
                    <Select
                        value={filters.status || "all"}
                        onValueChange={(value) =>
                            handleFilterChange({
                                status: value === "all" ? undefined : value,
                                event_type: filters.event_type,
                            })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
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

                <DataTable columns={columns} data={events} />

                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the event "
                                {selectedEvent?.title}". This action cannot be
                                undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AuthenticatedLayout>
    );
}
