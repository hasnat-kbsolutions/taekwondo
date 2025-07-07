import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";

interface Props {
    student: any;
}

interface Props {}

export default function Edit({ student }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        ...student,
        profile_image: null,
        id_passport_image: null,
        signature_image: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("club.students.update", student.id));
    };

    return (
        <AuthenticatedLayout header="Add Student">
            <Head title="Add Student" />
            <div className="container mx-auto py-10">
                <form onSubmit={handleSubmit} className="flex flex-wrap">
                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Password </Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="w-[25%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Phone</Label>
                        <PhoneInput
                            defaultCountry="MY"
                            value={data.phone}
                            onChange={(val) => setData("phone", val)}
                            className="w-full"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div className="w-[25%] px-2 mt-3">
                        <Label className="block text-sm mb-1">
                            Nationality
                        </Label>
                        <CountryDropdown
                            placeholder="Select nationality"
                            defaultValue={data.nationality || undefined}
                            onChange={(c) => setData("nationality", c.alpha3)}
                            slim={false}
                        />
                        {errors.nationality && (
                            <p className="text-red-500 text-sm">
                                {errors.nationality}
                            </p>
                        )}
                    </div>

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Grade</Label>
                        <Select
                            value={data.grade || ""}
                            onValueChange={(value) => setData("grade", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        Gup (Student Grades)
                                    </SelectLabel>
                                    <SelectItem value="10th Gup - White">
                                        10th Gup - White
                                    </SelectItem>
                                    <SelectItem value="9th Gup - White w/ Yellow Tag">
                                        9th Gup - White w/ Yellow Tag
                                    </SelectItem>
                                    <SelectItem value="8th Gup - Yellow">
                                        8th Gup - Yellow
                                    </SelectItem>
                                    <SelectItem value="7th Gup - Yellow w/ Green Tag">
                                        7th Gup - Yellow w/ Green Tag
                                    </SelectItem>
                                    <SelectItem value="6th Gup - Green">
                                        6th Gup - Green
                                    </SelectItem>
                                    <SelectItem value="5th Gup - Green w/ Blue Tag">
                                        5th Gup - Green w/ Blue Tag
                                    </SelectItem>
                                    <SelectItem value="4th Gup - Blue">
                                        4th Gup - Blue
                                    </SelectItem>
                                    <SelectItem value="3rd Gup - Blue w/ Red Tag">
                                        3rd Gup - Blue w/ Red Tag
                                    </SelectItem>
                                    <SelectItem value="2nd Gup - Red">
                                        2nd Gup - Red
                                    </SelectItem>
                                    <SelectItem value="1st Gup - Red w/ Black Tag">
                                        1st Gup - Red w/ Black Tag
                                    </SelectItem>
                                </SelectGroup>

                                <SelectGroup>
                                    <SelectLabel>
                                        Dan (Black Belt Ranks)
                                    </SelectLabel>
                                    <SelectItem value="1st Dan - Black Belt">
                                        1st Dan - Black Belt
                                    </SelectItem>
                                    <SelectItem value="2nd Dan - Assistant Instructor">
                                        2nd Dan - Assistant Instructor
                                    </SelectItem>
                                    <SelectItem value="3rd Dan - Instructor">
                                        3rd Dan - Instructor
                                    </SelectItem>
                                    <SelectItem value="4th Dan - International Instructor">
                                        4th Dan - International Instructor
                                    </SelectItem>
                                    <SelectItem value="5th Dan - International Instructor">
                                        5th Dan - International Instructor
                                    </SelectItem>
                                    <SelectItem value="6th Dan - Senior Instructor">
                                        6th Dan - Senior Instructor
                                    </SelectItem>
                                    <SelectItem value="7th Dan - Master">
                                        7th Dan - Master
                                    </SelectItem>
                                    <SelectItem value="8th Dan - Senior Master">
                                        8th Dan - Senior Master
                                    </SelectItem>
                                    <SelectItem value="9th Dan - Grand Master">
                                        9th Dan - Grand Master
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {errors.grade && (
                            <p className="text-red-500 text-sm">
                                {errors.grade}
                            </p>
                        )}
                    </div>

                    <div className="w-[25%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Gender</Label>
                        <Select
                            value={data.gender || ""}
                            onValueChange={(value) => setData("gender", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && (
                            <p className="text-red-500 text-sm">
                                {errors.gender}
                            </p>
                        )}
                    </div>

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
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

                    <div className="w-[25%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Country</Label>
                        <CountryDropdown
                            placeholder="Select country"
                            defaultValue={data.country} // your default or empty
                            onChange={(c) => setData("country", c.alpha3)}
                            slim={false}
                        />
                        {errors.country && (
                            <p className="text-red-500 text-sm">
                                {errors.country}
                            </p>
                        )}
                    </div>

                    <div className="w-[25%] px-2 mt-3">
                        <Label className="block text-sm mb-1">Status </Label>
                        <Select
                            value={String(data.status ?? true)} // default to "true"
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
                    <div className="w-[100%] px-2 mt-3">
                        <Label className="block text-sm mb-1">
                            Upload profile Image
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
                        {errors.profile_image && (
                            <p className="text-red-500 text-sm">
                                {errors.profile_image}
                            </p>
                        )}
                    </div>

                    <div className="w-[100%] px-2 mt-3">
                        <Label className="block text-sm mb-1">
                            Upload ID/Passport
                        </Label>
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

                    <div className="w-[100%] px-2 mt-3">
                        <Label className="block text-sm mb-1">
                            Upload signature
                        </Label>
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

                    <div className="w-full px-2 mt-3">
                        <Button type="submit" disabled={processing}>
                            Update
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
