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
import { ArrowLeft, Upload, FileText, X } from "lucide-react";
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
    document?: string;
}

interface Props {
    event: Event;
}

export default function Edit({ event }: Props) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        event.event_date ? new Date(event.event_date) : undefined
    );
    const [imagePreview, setImagePreview] = React.useState<string | null>(
        event.image ? `/storage/${event.image}` : null
    );
    const [documentName, setDocumentName] = React.useState<string | null>(
        event.document ? event.document.split('/').pop() || "Document" : null
    );
    const [existingImage, setExistingImage] = React.useState<string | null>(event.image || null);
    const [existingDocument, setExistingDocument] = React.useState<string | null>(event.document || null);
    const [imageChanged, setImageChanged] = React.useState(false);
    const [documentChanged, setDocumentChanged] = React.useState(false);

    const [originalStartTime] = React.useState(event.start_time || "");
    const [originalEndTime] = React.useState(event.end_time || "");

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
        document: null as File | null,
        remove_image: false,
        remove_document: false,
    });

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            setData("event_date", date.toISOString().split("T")[0]);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("image", file);
            setImageChanged(true);
            setData("remove_image", false);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setData("image", null);
        setData("remove_image", true);
        setImagePreview(null);
        setImageChanged(true);
    };

    const restoreImage = () => {
        setImagePreview(existingImage ? `/storage/${existingImage}` : null);
        setData("image", null);
        setData("remove_image", false);
        setImageChanged(false);
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("document", file);
            setDocumentName(file.name);
            setDocumentChanged(true);
            setData("remove_document", false);
        }
    };

    const clearDocument = () => {
        setData("document", null);
        setData("remove_document", true);
        setDocumentName(null);
        setDocumentChanged(true);
    };

    const restoreDocument = () => {
        setDocumentName(existingDocument ? existingDocument.split('/').pop() || "Document" : null);
        setData("document", null);
        setData("remove_document", false);
        setDocumentChanged(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare submission data with careful time handling
        // If time field is empty or whitespace-only, don't send it (let backend use existing)
        const startTimeValue = data.start_time && data.start_time.trim() ? data.start_time.trim() : "";
        const endTimeValue = data.end_time && data.end_time.trim() ? data.end_time.trim() : "";

        const submitData = {
            title: data.title,
            description: data.description,
            event_type: data.event_type,
            event_date: data.event_date,
            start_time: startTimeValue, // Send as empty string if not filled
            end_time: endTimeValue,     // Send as empty string if not filled
            venue: data.venue,
            status: data.status,
            is_public: data.is_public,
            image: data.image,
            document: data.document,
            remove_image: data.remove_image,
            remove_document: data.remove_document,
        };

        router.put(route("club.events.update", event.id), submitData, {
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Attachments</CardTitle>
                            <CardDescription>
                                Update event image and documents
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label>Event Image</Label>
                                    {existingImage && imageChanged && (
                                        <button
                                            type="button"
                                            onClick={restoreImage}
                                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                                        >
                                            Restore original
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Upload Area */}
                                    <div className="space-y-2">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                                            <input
                                                type="file"
                                                id="image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="image"
                                                className="flex flex-col items-center gap-2 cursor-pointer"
                                            >
                                                <Upload className="w-8 h-8 text-muted-foreground" />
                                                <div className="text-sm">
                                                    <p className="font-medium">
                                                        Click to upload
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        JPG, PNG up to 2MB
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div className="space-y-2">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-40 object-cover rounded-lg border"
                                                />
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={clearImage}
                                                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                        title="Remove image"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {imageChanged && (
                                                    <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                        Modified
                                                    </div>
                                                )}
                                            </div>
                                        ) : existingImage && !data.remove_image ? (
                                            <div className="relative">
                                                <img
                                                    src={`/storage/${existingImage}`}
                                                    alt="Current"
                                                    className="w-full h-40 object-cover rounded-lg border-2 border-green-300 bg-green-50"
                                                />
                                                <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Current
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                    title="Remove image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                                No image selected
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label>Event Document (PDF, DOC, DOCX)</Label>
                                    {existingDocument && documentChanged && (
                                        <button
                                            type="button"
                                            onClick={restoreDocument}
                                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                                        >
                                            Restore original
                                        </button>
                                    )}
                                </div>

                                {/* Current Document Status */}
                                {existingDocument && !data.remove_document && !documentChanged && (
                                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-6 h-6 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Current Document
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {existingDocument.split('/').pop()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/storage/${existingDocument}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    View
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={clearDocument}
                                                    className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                                    <input
                                        type="file"
                                        id="document"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleDocumentChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="document"
                                        className="flex flex-col items-center gap-2 cursor-pointer"
                                    >
                                        <FileText className="w-8 h-8 text-muted-foreground" />
                                        <div className="text-sm">
                                            <p className="font-medium">
                                                {documentChanged && documentName
                                                    ? `Selected: ${documentName}`
                                                    : "Click to upload document"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF, DOC, DOCX up to 5MB
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Document Changed Status */}
                                {documentChanged && data.remove_document && (
                                    <div className="bg-red-50 border border-red-300 rounded p-3">
                                        <p className="text-sm text-red-700 font-medium">
                                            Document will be removed when you save
                                        </p>
                                    </div>
                                )}
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
