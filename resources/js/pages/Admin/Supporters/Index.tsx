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
    const [selectedSupporter, setSelectedSupporter] =
        useState<Supporter | null>(null);

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

            <div className="container mx-auto py-10">
                {/* Table Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Supporters</CardTitle>
                        <Link href={route("admin.supporters.create")}>
                            <Button>Add Supporter</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
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
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
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
                                    <Label className="text-sm mb-1">
                                        Gender
                                    </Label>
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
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
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
                                    <Label className="text-sm mb-1">
                                        Status
                                    </Label>
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
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
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
                        <DialogContent className="w-96">
                            <div className="grid justify-center">
                                {/* Profile Image */}
                                <div className="grid justify-center">
                                    <div className="mt-1   bg-foreground  rounded-full w-28 h-28 flex justify-center items-center ">
                                        {selectedSupporter.profile_image ? (
                                            <img
                                                src={
                                                    selectedSupporter.profile_image
                                                }
                                                alt="Profile"
                                                className="w-28 h-28 rounded-full object-cover"
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
                                            <span className="italic text-muted-foreground">
                                                No image
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-start mt-4 mb-4 ">
                                    <div className="block">
                                        <DialogTitle>
                                            Supporter Details
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-center">
                                            Full supporter details
                                        </DialogDescription>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 text-sm">
                                <div className="flex justify-between">
                                    <p className="text-foreground  font-medium">
                                        Name:
                                    </p>{" "}
                                    {selectedSupporter.name}{" "}
                                    {selectedSupporter.surename}
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-foreground   font-medium">
                                        Email:
                                    </p>{" "}
                                    {selectedSupporter.email}
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-foreground  font-medium">
                                        Phone :
                                    </p>{" "}
                                    {selectedSupporter.phone}
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-foreground  font-medium">
                                        Gender:
                                    </p>{" "}
                                    {selectedSupporter.gender}
                                </div>
                                <div className="flex justify-between">
                                    <p className=" text-foreground  font-medium">
                                        Country:
                                    </p>{" "}
                                    {selectedSupporter.country}
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-foreground  font-medium">
                                        Type :
                                    </p>{" "}
                                    {selectedSupporter.type}
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-foreground font-medium">
                                        Status :
                                    </p>
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
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
