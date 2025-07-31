import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// ----------------- Interfaces -----------------
interface Student {
    id: number;
    name: string;
}

interface Supporter {
    id: number;
    name: string;
}

interface Organization {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    website?: string;
    status: boolean;
    students: Student[];
    supporters: Supporter[];
}

interface Props {
    organizations: Organization[];
    student: number;
    supporter: number;
}

// ----------------- Component Start -----------------
export default function Index({ organizations, student, supporter }: Props) {
    const [selectedOrganization, setSelectedOrganization] =
        useState<Organization | null>(null);

    const columns: ColumnDef<Organization>[] = [
        {
            header: "ID",
            accessorKey: "id",
        },
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Phone",
            accessorKey: "phone",
        },
        {
            header: "City",
            accessorKey: "city",
        },
        {
            header: "Country",
            accessorKey: "country",
        },
        {
            header: "Students",
            cell: ({ row }) => (
                <Link
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    href={route("admin.students.index", {
                        organization_id: row.original.id,
                    })}
                >
                    <Eye className="w-4 h-4" />
                    {row.original.students?.length ?? 0}
                </Link>
            ),
        },
        {
            header: "Supporters",
            cell: ({ row }) => (
                <Link
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    href={route("admin.supporters.index", {
                        organization_id: row.original.id,
                    })}
                >
                    <Eye className="w-4 h-4" />
                    {row.original.supporters?.length ?? 0}
                </Link>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status ? "default" : "destructive"}
                >
                    {row.original.status ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                setSelectedOrganization(row.original)
                            }
                        >
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.organizations.edit",
                                    row.original.id
                                )}
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.organizations.destroy",
                                    row.original.id
                                )}
                                method="delete"
                                as="button"
                            >
                                Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AuthenticatedLayout header="Ahli Gabungan">
            <Head title="Organizations" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Organizations</CardTitle>
                        <Link href={route("admin.organizations.create")}>
                            <Button>Add Supporter</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={organizations} />
                    </CardContent>
                </Card>

                {/* View Dialog */}
                {selectedOrganization && (
                 <Dialog
  open={!!selectedOrganization}
  onOpenChange={(open) => {
    if (!open) setSelectedOrganization(null);
  }}
>
  <DialogContent className="bg-background text-foreground ">
    <DialogTitle className="text-2xl text-foreground">Organization Details</DialogTitle>
    <DialogDescription className="text-foreground">Full organization details</DialogDescription>

    <div className="grid grid-cols-1 gap-5 mt-4">
      {/* Left Column */}
      <div className="space-y-3 ">
        {[
          { label: "Name", value: selectedOrganization.name },
          { label: "Email", value: selectedOrganization.email || "-" },
          { label: "Phone", value: selectedOrganization.phone || "-" },
          { label: "City", value: selectedOrganization.city || "-" },
          { label: "Country", value: selectedOrganization.country || "-" },
          {
            label: "Website",
            value: selectedOrganization.website ? (
              <a
                href={selectedOrganization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {selectedOrganization.website}
              </a>
            ) : (
              "-"
            ),
          },
        ].map((item, i) => (
          <div key={i} className="flex justify-between gap-2 items-start text-foreground">
            <p className="text-sm font-medium text-foreground min-w-[80px]">
              {item.label}:
            </p>
            <p className="text-sm">{item.value}</p>
          </div>
        ))}

        <div className="flex justify-between gap-2 items-center">
          <p className="text-sm font-medium text-foreground">Status :</p>
          <Badge
            variant={selectedOrganization.status ? "default" : "destructive"}
          >
            {selectedOrganization.status ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      
      <div className=" grid-cols-2 grid justify-between items-center overflow-y-scroll h-[20vh]">
        <div>
          <p className="text-2xl font-semibold mb-1">Students </p>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {selectedOrganization.students?.length > 0 ? (
              selectedOrganization.students.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))
            ) : (
              <li>-</li>
            )}
          </ul>
        </div>

        <div className="text-center">
          <p className="text-2xl font-semibold mb-1 mr-4">Supporters</p>
          <ul className="list-disc ml-16 space-y-1 text-sm  text-left">
            {selectedOrganization.supporters?.length > 0 ? (
              selectedOrganization.supporters.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))
            ) : (
              <li>-</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>

                )}
            </div>
        </AuthenticatedLayout>
    );
}
