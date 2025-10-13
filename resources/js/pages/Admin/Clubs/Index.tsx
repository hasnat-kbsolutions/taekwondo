import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PageProps } from "@/types"; // We'll define this below
import {
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    Users,
    GraduationCap,
    Heart,
    Wallet,
    ArrowRight,
} from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Organization {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
    city?: string;
    country?: string;
    logo?: string;
    phone?: string;
    tax_number?: string;
    invoice_prefix?: string;
    status: boolean;
    default_currency?: string;
    organization: Organization;
    user?: User;
    students?: Student[];
    instructors?: Instructor[];
    supporters?: Supporter[];
    payment_stats?: {
        total_payments: number;
        paid_count: number;
        pending_count: number;
        total_amount: number;
        average_amount: number;
        amounts_by_currency?: Record<string, number>;
        default_currency_code?: string;
    };
    attendance_stats?: {
        total_attendances: number;
        present_count: number;
        absent_count: number;
        late_count: number;
        attendance_rate: number;
    };
    certification_stats?: {
        total_certifications: number;
        completed_count: number;
        pending_count: number;
        completion_rate: number;
    };
    performance_metrics?: {
        total_members: number;
        student_to_instructor_ratio: number;
        monthly_revenue: number;
    };
}

interface Student {
    id: number;
    name: string;
    email?: string;
}

interface Instructor {
    id: number;
    name: string;
    email?: string;
}

interface Supporter {
    id: number;
    name: string;
    email?: string;
}

interface Props {
    clubs: Club[];
    organizations?: Organization[]; // optional
    filters: {
        organization_id?: string;
        country?: string;
    };
}

const columns = (onView: (instructor: Club) => void): ColumnDef<Club>[] => [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        header: "Logo",
        cell: ({ row }) =>
            row.original.logo ? (
                <img
                    src={row.original.logo}
                    alt="Club Logo"
                    className="w-10 h-10 object-cover rounded"
                />
            ) : (
                "-"
            ),
    },
    {
        header: "Club Name",
        cell: ({ row }) => row.original.user?.name ?? "-",
    },
    {
        header: "Organization",
        cell: ({ row }) => row.original.organization?.name ?? "-",
    },
    {
        header: "Location",
        cell: ({ row }) => (
            <div className="text-sm">
                {row.original.city && row.original.country ? (
                    <>
                        <div>{row.original.city}</div>
                        <div className="text-muted-foreground">
                            {row.original.country}
                        </div>
                    </>
                ) : (
                    row.original.city || row.original.country || "-"
                )}
            </div>
        ),
    },

    {
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status ? "default" : "destructive"}>
                {row.original.status ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        header: "Default Currency",
        accessorKey: "default_currency",
        cell: ({ row }) => {
            const currency = row.original.default_currency;
            return currency ? (
                <Badge variant="outline" className="font-mono">
                    {currency}
                </Badge>
            ) : (
                <span className="text-gray-400">Not set</span>
            );
        },
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
                    <DropdownMenuItem onClick={() => onView(row.original)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={route("admin.clubs.edit", row.original.id)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("admin.clubs.destroy", row.original.id)}
                            method="delete"
                            as="button"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function Index({ clubs, organizations = [], filters }: Props) {
    // Ensure clubs is always an array to prevent runtime errors
    const safeClubs = Array.isArray(clubs) ? clubs : [];

    // Utility function to safely format amounts
    const formatAmount = (amount: any) => {
        return (Number(amount) || 0).toFixed(2);
    };

    // Calculate total amounts by currency across all clubs
    const totalAmountsByCurrency: Record<string, number> = {};
    let defaultCurrencyCode = "MYR";

    safeClubs.forEach((club) => {
        if (club.payment_stats?.amounts_by_currency) {
            Object.entries(club.payment_stats.amounts_by_currency).forEach(
                ([code, amount]) => {
                    totalAmountsByCurrency[code] =
                        (totalAmountsByCurrency[code] || 0) + amount;
                }
            );
        }
        if (club.payment_stats?.default_currency_code) {
            defaultCurrencyCode = club.payment_stats.default_currency_code;
        }
    });

    const stats = [
        {
            label: "Total Revenue",
            count: (
                <div className="space-y-1 w-full">
                    <div className="text-lg font-bold">
                        {defaultCurrencyCode === "MYR"
                            ? "RM"
                            : defaultCurrencyCode}{" "}
                        {formatAmount(
                            totalAmountsByCurrency[defaultCurrencyCode] || 0
                        )}
                    </div>
                    {Object.keys(totalAmountsByCurrency).length > 1 && (
                        <div className="text-xs text-muted-foreground space-y-1">
                            {Object.entries(totalAmountsByCurrency)
                                .filter(
                                    ([code]) => code !== defaultCurrencyCode
                                )
                                .map(([code, amount]) => (
                                    <div
                                        key={code}
                                        className="flex justify-between"
                                    >
                                        <span>{code}:</span>
                                        <span>{formatAmount(amount)}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ),
            icon: <Wallet className="h-6 w-6 text-primary" />,
            url: route("admin.payments.index"),
        },
        {
            label: "Total Students",
            count: Number(
                safeClubs.reduce(
                    (total, club) => total + Number(club.students?.length || 0),
                    0
                )
            ),
            icon: <Users className="h-6 w-6 text-blue-600" />,
            url: route("admin.students.index"),
        },
        {
            label: "Total Instructors",
            count: Number(
                safeClubs.reduce(
                    (total, club) =>
                        total + Number(club.instructors?.length || 0),
                    0
                )
            ),
            icon: <GraduationCap className="h-6 w-6 text-green-600" />,
            url: route("admin.instructors.index"),
        },
        {
            label: "Total Supporters",
            count: Number(
                safeClubs.reduce(
                    (total, club) =>
                        total + Number(club.supporters?.length || 0),
                    0
                )
            ),
            icon: <Heart className="h-6 w-6 text-purple-600" />,
            url: route("admin.supporters.index"),
        },
    ];

    const [organizationId, setOrganizationId] = useState(
        filters.organization_id || ""
    );
    const [country, setCountry] = useState(filters.country || "");

    const handleFilterChange = (extraParams = {}) => {
        router.get(
            route("admin.clubs.index"),
            {
                ...extraParams,
                organization_id: organizationId || null,
                country: country || null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setOrganizationId("");
        setCountry("");
        router.get(
            route("admin.clubs.index"),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    return (
        <AuthenticatedLayout header="Clubs">
            <Head title="Organizations" />
            <div className="container mx-auto py-10">
                {/* Statistics Cards */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                        Overview Statistics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                        {stats.map((item) => (
                            <Link
                                key={item.label}
                                href={item.url}
                                className={`block group ${
                                    item.label === "Total Revenue"
                                        ? "col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                                        : ""
                                }`}
                            >
                                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 border-2 hover:border-primary/20">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                            {item.label}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            {item.icon}
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {item.count}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Clubs</CardTitle>
                        <Link href={route("admin.clubs.create")}>
                            <Button>Add Club</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-end gap-4 flex-wrap">
                                <div className="flex flex-col w-[200px]">
                                    <Label className="text-sm mb-1">
                                        Organizations
                                    </Label>
                                    <Select
                                        value={organizationId || ""}
                                        onValueChange={(val) => {
                                            setOrganizationId(val);
                                            handleFilterChange({ country });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Organizations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            {organizations.map((org) => (
                                                <SelectItem
                                                    key={org.id}
                                                    value={org.id.toString()}
                                                >
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col w-[200px]">
                                    <Label className="text-sm mb-1">
                                        Country
                                    </Label>
                                    <CountryDropdown
                                        placeholder="All Countries"
                                        defaultValue={country || ""}
                                        onChange={(c) => {
                                            const selected = c?.alpha3 || "";
                                            setCountry(selected);
                                            handleFilterChange({
                                                organization_id: organizationId,
                                            });
                                        }}
                                        slim={false}
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        variant="secondary"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* DataTable */}
                        <DataTable
                            columns={columns((club) => setSelectedClub(club))}
                            data={safeClubs}
                        />
                    </CardContent>
                </Card>
                {/* View Dialog */}
                {selectedClub && (
                    <Dialog
                        open={!!selectedClub}
                        onOpenChange={(open) => {
                            if (!open) setSelectedClub(null);
                        }}
                    >
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Club Details</DialogTitle>
                                <DialogDescription>
                                    View detailed information about the club.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedClub && (
                                <div className="space-y-6">
                                    {/* Club Header Section */}
                                    <div className="flex justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-primary/10 text-primary text-4xl font-bold border-2 border-primary/20 shadow-lg">
                                                {selectedClub.logo ? (
                                                    <img
                                                        src={selectedClub.logo}
                                                        alt="Club Logo"
                                                        className="w-32 h-32 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    selectedClub.name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-semibold text-xl">
                                                    {selectedClub.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Club ID: {selectedClub.id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Details Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            {
                                                label: "Email",
                                                value:
                                                    selectedClub.user?.email ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Phone",
                                                value:
                                                    selectedClub.phone ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "City",
                                                value:
                                                    selectedClub.city ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Country",
                                                value:
                                                    selectedClub.country ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Tax Number",
                                                value:
                                                    selectedClub.tax_number ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Invoice Prefix",
                                                value:
                                                    selectedClub.invoice_prefix ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Organization",
                                                value:
                                                    selectedClub.organization
                                                        ?.name ||
                                                    "Not specified",
                                            },
                                            {
                                                label: "Status",
                                                value: (
                                                    <Badge
                                                        variant={
                                                            selectedClub.status
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                    >
                                                        {selectedClub.status
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                ),
                                            },
                                        ].map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex flex-col space-y-1"
                                            >
                                                <Label className="text-sm font-medium text-muted-foreground">
                                                    {item.label}
                                                </Label>
                                                <div className="text-sm">
                                                    {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Students List */}
                                    {selectedClub.students &&
                                        selectedClub.students.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Students (
                                                        {
                                                            selectedClub
                                                                .students.length
                                                        }
                                                        )
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {selectedClub.students.map(
                                                            (student) => (
                                                                <div
                                                                    key={
                                                                        student.id
                                                                    }
                                                                    className="flex items-center justify-between p-2 border rounded-lg"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                                                                            {student.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {
                                                                                    student.name
                                                                                }
                                                                            </p>
                                                                            {student.email && (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {
                                                                                        student.email
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                    {/* Instructors List */}
                                    {selectedClub.instructors &&
                                        selectedClub.instructors.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Instructors (
                                                        {
                                                            selectedClub
                                                                .instructors
                                                                .length
                                                        }
                                                        )
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {selectedClub.instructors.map(
                                                            (instructor) => (
                                                                <div
                                                                    key={
                                                                        instructor.id
                                                                    }
                                                                    className="flex items-center justify-between p-2 border rounded-lg"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                                                                            {instructor.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {
                                                                                    instructor.name
                                                                                }
                                                                            </p>
                                                                            {instructor.email && (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {
                                                                                        instructor.email
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                    {/* Supporters List */}
                                    {selectedClub.supporters &&
                                        selectedClub.supporters.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Supporters (
                                                        {
                                                            selectedClub
                                                                .supporters
                                                                .length
                                                        }
                                                        )
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {selectedClub.supporters.map(
                                                            (supporter) => (
                                                                <div
                                                                    key={
                                                                        supporter.id
                                                                    }
                                                                    className="flex items-center justify-between p-2 border rounded-lg"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                                                                            {supporter.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {
                                                                                    supporter.name
                                                                                }
                                                                            </p>
                                                                            {supporter.email && (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {
                                                                                        supporter.email
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
