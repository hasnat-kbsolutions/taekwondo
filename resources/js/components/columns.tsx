import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export type Location = {
    id: number;
    name: string;
    description: string | null;
    longitude: number;
    latitude: number;
    images: { id: number; image_path: string }[];
};

export const columns: ColumnDef<Location>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "longitude", header: "Longitude" },
    { accessorKey: "latitude", header: "Latitude" },
    {
        id: "images",
        header: "Images",
        cell: ({ row }) => (
            <div>
                {row.original.images.map((img) => (
                    <img
                        key={img.id}
                        src={`/storage/${img.image_path}`}
                        alt="location"
                        className="w-16 h-16 inline-block"
                    />
                ))}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <Link href={route("locations.edit", row.original.id)}>
                    <Button variant="outline" size="sm">
                        Edit
                    </Button>
                </Link>
                <Link
                    href={route("locations.destroy", row.original.id)}
                    method="delete"
                    as="button"
                >
                    <Button variant="destructive" size="sm">
                        Delete
                    </Button>
                </Link>
            </div>
        ),
    },
];
