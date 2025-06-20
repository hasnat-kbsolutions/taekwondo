import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    supporter: any;
    branches: any[];
    organizations: any[];
    clubs: any[];
}

export default function Edit({
    supporter,
    branches,
    organizations,
    clubs,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        branch_id: supporter.branch_id || "",
        country: supporter.country || "",
        organization_id: supporter.organization_id || "",
        club_id: supporter.club_id || "",
        name: supporter.name || "",
        surename: supporter.surename || "",
        gender: supporter.gender || "",
        email: supporter.email || "",
        phone: supporter.phone || "",
        type: supporter.type || "",
        status: supporter.status || false,
        profile_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("supporters.update", supporter.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Edit Supporter">
            <Head title="Edit Supporter" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Supporter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap"
                        >
                            <div className="w-[50%] px-2">
                                <Label className="block text-sm mb-1">
                                    Select Branch{" "}
                                </Label>

                                <Select
                                    value={data.branch_id?.toString()}
                                    onValueChange={(value) =>
                                        setData("branch_id", parseInt(value))
                                    }
                                >
                                    <SelectTrigger className="w-full border rounded px-3 py-2">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem
                                                key={branch.id}
                                                value={branch.id.toString()}
                                            >
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* // <select
                                //     value={data.branch_id}
                                //     onChange={(e) =>
                                //         setData("branch_id", e.target.value)
                                //     }
                                //     className="w-full border rounded p-2"
                                // >
                                //     <option value="">Select Branch</option>
                                //     {branches.map((branch) => (
                                //         <option
                                //             key={branch.id}
                                //             value={branch.id}
                                //         >
                                //             {branch.name}
                                //         </option>
                                //     ))}
                                // </select> */}

                                {errors.branch_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.branch_id}
                                    </p>
                                )}
                            </div>
                            <div className="w-[50%] px-2">
                                <Label className="block text-sm mb-1">
                                    Select Organization{" "}
                                </Label>

                                <Select
                                    value={data.organization_id?.toString()}
                                    onValueChange={(value) =>
                                        setData(
                                            "organization_id",
                                            parseInt(value)
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full border rounded px-3 py-2">
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {organizations.map((org) => (
                                                <SelectItem
                                                    key={org.id}
                                                    value={org.id.toString()}
                                                >
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {/* <select
                                    value={data.organization_id}
                                    onChange={(e) =>
                                        setData(
                                            "organization_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">
                                        Select Organization
                                    </option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select> */}
                                {errors.organization_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.organization_id}
                                    </p>
                                )}
                            </div>
                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Club{" "}
                                </Label>
                                <select
                                    value={data.club_id}
                                    onChange={(e) =>
                                        setData("club_id", e.target.value)
                                    }
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
                                <Label className="block text-sm mb-1">
                                    Name{" "}
                                </Label>
                                <Input
                                    placeholder="Name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Surname{" "}
                                </Label>
                                <Input
                                    placeholder="Surename"
                                    value={data.surename}
                                    onChange={(e) =>
                                        setData("surename", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Country{" "}
                                </Label>
                                <Input
                                    placeholder="Country"
                                    value={data.country}
                                    onChange={(e) =>
                                        setData("country", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Gender{" "}
                                </Label>
                                <Input
                                    placeholder="Gender"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Email{" "}
                                </Label>
                                <Input
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Phone{" "}
                                </Label>
                                <Input
                                    placeholder="Phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Type
                                </Label>
                                <Input
                                    placeholder="Type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-full px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Files{" "}
                                </Label>
                                <Input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "profile_image",
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                />
                            </div>

                            <div className="w-full px-2 mt-3">
                                <Button type="submit" disabled={processing}>
                                    Update
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
