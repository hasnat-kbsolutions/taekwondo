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
import { toast } from "sonner";

interface Props {
    clubs: any[];
    organizations: any[];
    student: any;
}

export default function Edit({ clubs, organizations, student }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        ...student,
        profile_image: null,
        id_passport_image: null,
        signature_image: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("club.students.update", student.id), {
            onSuccess: () => toast.success("Student updated successfully"),
            onError: () =>
                toast.error("Please fix the form errors and try again."),
        });
    };

    const renderError = (field: keyof typeof errors) =>
        errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        );

    return (
        <AuthenticatedLayout header="Edit Student">
            <Head title="Edit Student" />
            <div className="container mx-auto py-10">
                <form onSubmit={handleSubmit} className="flex flex-wrap">
                

                    {/* Optional: Code */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Code</Label>
                        <Input
                            placeholder="Code"
                            value={data.code}
                            onChange={(e) => setData("code", e.target.value)}
                        />
                        {renderError("code")}
                    </div>

                    {/* Required: Name */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {renderError("name")}
                    </div>

                    {/* Optional: Surname */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Surname</Label>
                        <Input
                            placeholder="Surname"
                            value={data.surname}
                            onChange={(e) => setData("surname", e.target.value)}
                        />
                    </div>

                    {/* Required: Email */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {renderError("email")}
                    </div>

                    {/* Required: Password */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Password 
                        </Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        {renderError("password")}
                    </div>

                    {/* Required: Phone */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Phone <span className="text-red-500">*</span>
                        </Label>
                        <PhoneInput
                            defaultCountry="MY"
                            value={data.phone}
                            onChange={(val) => setData("phone", val)}
                            className="w-full"
                        />
                        {renderError("phone")}
                    </div>

                    {/* Required: Nationality */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Nationality <span className="text-red-500">*</span>
                        </Label>
                        <CountryDropdown
                            placeholder="Select nationality"
                            defaultValue={data.nationality}
                            onChange={(c) => setData("nationality", c.alpha3)}
                            slim={false}
                        />
                        {renderError("nationality")}
                    </div>

                    {/* Required: DOB */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Date of Birth{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="date"
                            value={data.dob}
                            onChange={(e) => setData("dob", e.target.value)}
                        />
                        {renderError("dob")}
                    </div>

                    {/* Optional: Date of Deactivation/Death */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Date of Deactivation</Label>
                        <Input
                            type="date"
                            value={data.dod}
                            onChange={(e) => setData("dod", e.target.value)}
                        />
                        {renderError("dod")}
                    </div>

                    {/* Required: Grade */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Grade <span className="text-red-500">*</span>
                        </Label>
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
                        {renderError("grade")}
                    </div>

                    {/* Required: Gender */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Gender <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={data.gender}
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
                        {renderError("gender")}
                    </div>

                    {/* Required: ID/Passport */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            ID/Passport <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="ID or Passport Number"
                            value={data.id_passport}
                            onChange={(e) =>
                                setData("id_passport", e.target.value)
                            }
                        />
                        {renderError("id_passport")}
                    </div>

                    {/* Optional: Skype */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Skype</Label>
                        <Input
                            placeholder="Skype"
                            value={data.skype}
                            onChange={(e) => setData("skype", e.target.value)}
                        />
                        {renderError("skype")}
                    </div>

                    {/* Optional: Website */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Website</Label>
                        <Input
                            placeholder="Website"
                            value={data.website}
                            onChange={(e) => setData("website", e.target.value)}
                        />
                        {renderError("website")}
                    </div>

                    {/* Optional Address Fields */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>City</Label>
                        <Input
                            placeholder="City"
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                        />
                        {renderError("city")}
                    </div>

                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Postal Code</Label>
                        <Input
                            placeholder="Postal Code"
                            value={data.postal_code}
                            onChange={(e) =>
                                setData("postal_code", e.target.value)
                            }
                        />
                        {renderError("postal_code")}
                    </div>

                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Street</Label>
                        <Input
                            placeholder="Street"
                            value={data.street}
                            onChange={(e) => setData("street", e.target.value)}
                        />
                        {renderError("street")}
                    </div>

                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Country</Label>
                        <CountryDropdown
                            placeholder="Select country"
                            defaultValue={data.country}
                            onChange={(c) => setData("country", c.alpha3)}
                            slim={false}
                        />
                        {renderError("country")}
                    </div>

                    {/* Optional: Status */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Status</Label>
                        <Select
                            value={String(data.status)}
                            onValueChange={(val) =>
                                setData("status", val === "true")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {renderError("status")}
                    </div>

                    {/* File Uploads */}
                    <div className="w-full px-2 mt-3">
                        <Label>Upload Profile Image</Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData(
                                    "profile_image",
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />
                        {renderError("profile_image")}
                    </div>

                    <div className="w-full px-2 mt-3">
                        <Label>Upload ID/Passport Image</Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData(
                                    "id_passport_image",
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />
                        {renderError("id_passport_image")}
                    </div>

                    <div className="w-full px-2 mt-3">
                        <Label>Upload Signature</Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData(
                                    "signature_image",
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />
                        {renderError("signature_image")}
                    </div>

                    <div className="w-full px-2 mt-5">
                        <Button type="submit" disabled={processing}>
                            Update
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
