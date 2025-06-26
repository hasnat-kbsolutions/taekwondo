// resources/js/Pages/Students/Create.tsx
import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface Props {
    // branches: any[];
    // organizations: any[];
    clubs: any[];
}

export default function Create({ clubs }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        // branch_id: "",
        // organization_id: "",
        club_id: "",
        uid: "",
        code: "",
        name: "",
        surname: "",
        nationality: "",
        dob: "",
        dod: "",
        grade: "",
        gender: "",
        id_passport: "",
        profile_image: null as File | null,
        id_passport_image: null as File | null,
        signature_image: null as File | null,
        email: "",
        phone: "",
        skype: "",
        website: "",
        city: "",
        postal_code: "",
        street: "",
        country: "",
        status: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("branch.students.store"));
    };

    return (
        <AuthenticatedLayout header="Add Student">
            <Head title="Add Student" />
            <div className="container mx-auto py-10">
                <form onSubmit={handleSubmit} className="flex flex-wrap">
                    {/* <div className="w-[50%] px-2">
                        <Label className="block text-sm mb-1">
                            Select Branch{" "}
                        </Label>
                        <select
                            value={data.branch_id}
                            onChange={(e) =>
                                setData("branch_id", e.target.value)
                            }
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                        {errors.branch_id && (
                            <p className="text-red-500 text-sm">
                                {errors.branch_id}
                            </p>
                        )}
                    </div> */}

                    {/* <div className="w-[50%] px-2">
                        <Label className="block text-sm mb-1">
                            Organization{" "}
                        </Label>
                        <select
                            value={data.organization_id}
                            onChange={(e) =>
                                setData("organization_id", e.target.value)
                            }
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select Organization</option>
                            {organizations.map((org) => (
                                <option key={org.id} value={org.id}>
                                    {org.name}
                                </option>
                            ))}
                        </select>
                        {errors.organization_id && (
                            <p className="text-red-500 text-sm">
                                {errors.organization_id}
                            </p>
                        )}
                    </div> */}

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">
                            Select Club{" "}
                        </Label>
                        <select
                            value={data.club_id}
                            onChange={(e) => setData("club_id", e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select Club</option>
                            {clubs.map((club) => (
                                <option key={club.id} value={club.id}>
                                    {club.name}
                                </option>
                            ))}
                        </select>
                        {errors.club_id && (
                            <p className="text-red-500 text-sm">
                                {errors.club_id}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">UID </Label>
                        <Input
                            placeholder="UID"
                            value={data.uid}
                            onChange={(e) => setData("uid", e.target.value)}
                        />
                        {errors.uid && (
                            <p className="text-red-500 text-sm">{errors.uid}</p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Code </Label>
                        <Input
                            placeholder="Code"
                            value={data.code}
                            onChange={(e) => setData("code", e.target.value)}
                        />
                        {errors.code && (
                            <p className="text-red-500 text-sm">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Name </Label>
                        <Input
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Surname </Label>

                        <Input
                            placeholder="Surname"
                            value={data.surname}
                            onChange={(e) => setData("surname", e.target.value)}
                        />
                        {errors.surname && (
                            <p className="text-red-500 text-sm">
                                {errors.surname}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">
                            Nationality{" "}
                        </Label>
                        <Input
                            placeholder="Nationality"
                            value={data.nationality}
                            onChange={(e) =>
                                setData("nationality", e.target.value)
                            }
                        />
                        {errors.nationality && (
                            <p className="text-red-500 text-sm">
                                {errors.nationality}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Date </Label>
                        <Input
                            type="date"
                            placeholder="Date of Birth"
                            value={data.dob}
                            onChange={(e) => setData("dob", e.target.value)}
                        />
                        {errors.dob && (
                            <p className="text-red-500 text-sm">{errors.dob}</p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Date </Label>
                        <Input
                            type="date"
                            placeholder="Date of Death"
                            value={data.dod}
                            onChange={(e) => setData("dod", e.target.value)}
                        />
                        {errors.dod && (
                            <p className="text-red-500 text-sm">{errors.dod}</p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Grade </Label>
                        <Input
                            placeholder="Grade"
                            value={data.grade}
                            onChange={(e) => setData("grade", e.target.value)}
                        />
                        {errors.grade && (
                            <p className="text-red-500 text-sm">
                                {errors.grade}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Gender </Label>
                        <select
                            value={data.gender}
                            onChange={(e) => setData("gender", e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        >
                            <option value="" disabled>
                                Select Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-500 text-sm">
                                {errors.gender}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Passport </Label>
                        <Input
                            placeholder="ID/Passport"
                            value={data.id_passport}
                            onChange={(e) =>
                                setData("id_passport", e.target.value)
                            }
                        />
                        {errors.id_passport && (
                            <p className="text-red-500 text-sm">
                                {errors.id_passport}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Files 01 </Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData(
                                    "profile_image",
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />
                        {errors.profile_image && (
                            <p className="text-red-500 text-sm">
                                {errors.profile_image}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Files 02 </Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData(
                                    "id_passport_image",
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />
                        {errors.id_passport_image && (
                            <p className="text-red-500 text-sm">
                                {errors.id_passport_image}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Files 03 </Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData(
                                    "signature_image",
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />
                        {errors.signature_image && (
                            <p className="text-red-500 text-sm">
                                {errors.signature_image}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Email </Label>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Phone </Label>
                        <Input
                            type="number"
                            placeholder="Phone"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Skype</Label>
                        <Input
                            placeholder="Skype"
                            value={data.skype}
                            onChange={(e) => setData("skype", e.target.value)}
                        />
                        {errors.skype && (
                            <p className="text-red-500 text-sm">
                                {errors.skype}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Website</Label>
                        <Input
                            placeholder="Website"
                            value={data.website}
                            onChange={(e) => setData("website", e.target.value)}
                        />
                        {errors.website && (
                            <p className="text-red-500 text-sm">
                                {errors.website}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">City </Label>
                        <Input
                            placeholder="City"
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                        />
                        {errors.city && (
                            <p className="text-red-500 text-sm">
                                {errors.city}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">
                            Postal Code{" "}
                        </Label>
                        <Input
                            type="number"
                            placeholder="Postal Code"
                            value={data.postal_code}
                            onChange={(e) =>
                                setData("postal_code", e.target.value)
                            }
                        />
                        {errors.postal_code && (
                            <p className="text-red-500 text-sm">
                                {errors.postal_code}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Street </Label>
                        <Input
                            placeholder="Street"
                            value={data.street}
                            onChange={(e) => setData("street", e.target.value)}
                        />
                        {errors.street && (
                            <p className="text-red-500 text-sm">
                                {errors.street}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Country </Label>
                        <Input
                            placeholder="Country"
                            value={data.country}
                            onChange={(e) => setData("country", e.target.value)}
                        />
                        {errors.country && (
                            <p className="text-red-500 text-sm">
                                {errors.country}
                            </p>
                        )}
                    </div>

                    <div className="w-[50%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Status </Label>
                        <Select
                            value={data.status?.toString()}
                            onValueChange={(val) =>
                                setData("status", val === "true")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-red-500 text-sm">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div className="w-full px-2 mt-3">
                        <Button type="submit" disabled={processing}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
