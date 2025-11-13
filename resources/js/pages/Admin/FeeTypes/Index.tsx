import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeeType {
    id: number;
    name: string;
    default_amount: number | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    feeTypes: FeeType[];
}

export default function Index({ feeTypes }: Props) {
    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this fee type?")) {
            router.delete(route("admin.fee-types.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout header="Fee Types">
            <Head title="Fee Types" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Fee Types</CardTitle>
                        <Link href={route("admin.fee-types.create")}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Fee Type
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {feeTypes.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Default Amount</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {feeTypes.map((feeType) => (
                                        <TableRow key={feeType.id}>
                                            <TableCell className="font-medium">
                                                {feeType.name}
                                            </TableCell>
                                            <TableCell>
                                                {feeType.default_amount ? (
                                                    `RM ${parseFloat(
                                                        feeType.default_amount.toString()
                                                    ).toFixed(2)}`
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Not Set
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {feeType.description || (
                                                    <span className="text-muted-foreground">
                                                        No description
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "admin.fee-types.edit",
                                                                    feeType.id
                                                                )}
                                                            >
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    feeType.id
                                                                )
                                                            }
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">
                                    No fee types found. Create your first fee
                                    type to get started.
                                </p>
                                <Link href={route("admin.fee-types.create")}>
                                    <Button className="mt-4">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Fee Type
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
