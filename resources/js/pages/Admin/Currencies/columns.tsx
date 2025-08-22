import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    EyeOpenIcon,
    EyeClosedIcon,
    StarIcon,
    Pencil1Icon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { Link } from "@inertiajs/react";

interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    decimal_places: number;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
}

interface ActionsProps {
    onToggleActive: (currency: Currency) => void;
    onSetDefault: (currency: Currency) => void;
    onDelete: (currency: Currency) => void;
}

export const columns: (actions: ActionsProps) => ColumnDef<Currency>[] = ({
    onToggleActive,
    onSetDefault,
    onDelete,
}) => [
    {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
            <div className="font-mono font-medium">{row.getValue("code")}</div>
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
            <div className="text-lg font-semibold">
                {row.getValue("symbol")}
            </div>
        ),
    },
    {
        accessorKey: "decimal_places",
        header: "Decimals",
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("decimal_places")}</div>
        ),
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active") as boolean;
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "is_default",
        header: "Default",
        cell: ({ row }) => {
            const isDefault = row.getValue("is_default") as boolean;
            return isDefault ? (
                <Badge variant="default" className="bg-yellow-600">
                    <StarIcon className="w-3 h-3 mr-1" />
                    Default
                </Badge>
            ) : null;
        },
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
            <div className="text-sm text-gray-500">
                {new Date(row.getValue("created_at")).toLocaleDateString()}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const currency = row.original;

            return (
                <div className="flex items-center gap-2">
                    {/* Toggle Active/Inactive */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleActive(currency)}
                        disabled={currency.is_default}
                        title={currency.is_active ? "Deactivate" : "Activate"}
                    >
                        {currency.is_active ? (
                            <EyeClosedIcon className="w-4 h-4" />
                        ) : (
                            <EyeOpenIcon className="w-4 h-4" />
                        )}
                    </Button>

                    {/* Set as Default */}
                    {!currency.is_default && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSetDefault(currency)}
                            title="Set as Default"
                        >
                            <StarIcon className="w-4 h-4" />
                        </Button>
                    )}

                    {/* Edit */}
                    <Link href={route("admin.currencies.edit", currency.id)}>
                        <Button variant="outline" size="sm" title="Edit">
                            <Pencil1Icon className="w-4 h-4" />
                        </Button>
                    </Link>

                    {/* Delete */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(currency)}
                        disabled={currency.is_default}
                        title="Delete"
                        className="text-red-600 hover:text-red-700"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </div>
            );
        },
    },
];
