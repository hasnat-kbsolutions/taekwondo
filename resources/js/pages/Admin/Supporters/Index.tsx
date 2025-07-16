import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { DataTable } from "@/components/DataTable";
import { columns, Supporter } from "@/components/columns/supporters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
interface Props {
    supporters: Supporter[];
    organizations: { id: number; name: string }[];
    clubs: { id: number; name: string }[];
    filters: {
        organization_id?: string;
        club_id?: string;
        gender?: string;
        status?: string;
    };
}

export default function Index({
    supporters,
    organizations,
    clubs,
    filters,
}: Props) {
    const [organizationId, setOrganizationId] = useState(
        filters.organization_id || ""
    );
    const [clubId, setClubId] = useState(filters.club_id || "");
    const [gender, setGender] = useState(filters.gender || "");
    const [status, setStatus] = useState(filters.status || "");
const [selectedSupporter, setSelectedSupporter] = useState<Supporter | null>(
    null
);


    const handleFilterChange = ({
        organization_id,
        club_id,
        gender,
        status,
    }: {
        organization_id?: string;
        club_id?: string;
        gender?: string;
        status?: string;
    }) => {
        router.get(
            route("admin.supporters.index"),
            {
                organization_id,
                club_id,
                gender,
                status,
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
        setClubId("");
        setGender("");
        setStatus("");
        router.get(route("admin.supporters.index"));
    };

    return (
        <AuthenticatedLayout header="Supporters">
            <Head title="Supporters" />

            <div className="container mx-auto py-10 space-y-6">
                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            {/* Organization */}
                            <div className="w-[200px]">
                                <Label className="text-sm mb-1">
                                    Organization
                                </Label>
                                <Select
                                    value={organizationId}
                                    onValueChange={(val) => {
                                        const selected =
                                            val === "all" ? "" : val;
                                        setOrganizationId(selected);
                                        handleFilterChange({
                                            organization_id: organizationId,
                                            club_id: clubId,
                                            gender,
                                            status,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Organizations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
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

                            {/* Club */}
                            <div className="w-[200px]">
                                <Label className="text-sm mb-1">Club</Label>
                                <Select
                                    value={clubId}
                                    onValueChange={(val) => {
                                        const selected =
                                            val === "all" ? "" : val;
                                        setClubId(selected);
                                        handleFilterChange({
                                            organization_id: organizationId,
                                            club_id: selected,
                                            gender,
                                            status,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Clubs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {clubs.map((club) => (
                                            <SelectItem
                                                key={club.id}
                                                value={club.id.toString()}
                                            >
                                                {club.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Gender */}
                            <div className="w-[200px]">
                                <Label className="text-sm mb-1">Gender</Label>
                                <Select
                                    value={gender}
                                    onValueChange={(val) => {
                                        const selected =
                                            val === "all" ? "" : val;
                                        setGender(selected);
                                        handleFilterChange({
                                            organization_id: organizationId,
                                            club_id: clubId,
                                            gender: selected,
                                            status,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Genders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="w-[200px]">
                                <Label className="text-sm mb-1">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={(val) => {
                                        const selected =
                                            val === "all" ? "" : val;
                                        setStatus(selected);
                                        handleFilterChange({
                                            organization_id: organizationId,
                                            club_id: clubId,
                                            gender,
                                            status: selected,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reset */}
                            <div className="flex items-end">
                                <Button
                                    className="flex flex-wrap items-center gap-2 md:flex-row bg-primary text-black"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Supporters</CardTitle>
                        <Link href={route("admin.supporters.create")}>
                            <Button>Add Supporter</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns((supporter) =>
                                setSelectedSupporter(supporter)
                            )}
                            data={supporters}
                        />
                    </CardContent>
                </Card>
                {selectedSupporter && (
                    <Dialog
                        open={!!selectedSupporter}
                        onOpenChange={(open) => {
                            if (!open) setSelectedSupporter(null);
                        }}
                    >
                        <DialogContent>
                            <DialogTitle>Supporter Details</DialogTitle>
                            <DialogDescription>
                                Full supporter details
                            </DialogDescription>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Name:</strong>{" "}
                                    {selectedSupporter.name}{" "}
                                    {selectedSupporter.surename}
                                </div>
                                <div>
                                    <strong>Email:</strong>{" "}
                                    {selectedSupporter.email}
                                </div>
                                <div>
                                    <strong>Phone:</strong>{" "}
                                    {selectedSupporter.phone}
                                </div>
                                <div>
                                    <strong>Gender:</strong>{" "}
                                    {selectedSupporter.gender}
                                </div>
                                <div>
                                    <strong>Country:</strong>{" "}
                                    {selectedSupporter.country}
                                </div>
                                <div>
                                    <strong>Type:</strong>{" "}
                                    {selectedSupporter.type}
                                </div>
                                <div>
                                    <strong>Status:</strong>
                                    <Badge
                                        variant={
                                            selectedSupporter.status
                                                ? "default"
                                                : "destructive"
                                        }
                                    >
                                        {selectedSupporter.status
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>

                                {/* Profile Image */}
                                <div className="col-span-2">
                                    <strong>Profile Image:</strong>
                                    <div className="mt-1">
                                        {selectedSupporter.profile_image ? (
                                            <img
                                                src={
                                                    selectedSupporter.profile_image
                                                }
                                                alt="Profile"
                                                className="w-24 h-24 rounded object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                    const fallback =
                                                        document.createElement(
                                                            "span"
                                                        );
                                                    fallback.className =
                                                        "italic text-gray-500";
                                                    fallback.textContent =
                                                        "No image";
                                                    e.currentTarget.parentNode?.appendChild(
                                                        fallback
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <span className="italic text-gray-500">
                                                No image
                                            </span>
                                        )}
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
