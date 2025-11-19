import React, { useEffect, useMemo } from "react";
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
    student: any;
    plans: any[];
    currencies: any[];
    feePlan: any;
}

export default function Edit({
    clubs,
    student,
    plans,
    currencies,
    feePlan,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        ...student,
        _method: "put",
        profile_image: null as File | null,
        identification_document: null as File | null,
        plan_id: feePlan?.plan_id ? String(feePlan.plan_id) : "",
        interval: feePlan?.interval || "monthly",
        interval_count: feePlan?.interval_count || null,
        discount_type:
            feePlan?.discount_type || ("" as "percent" | "fixed" | ""),
        discount_value: feePlan?.discount_value || null,
        currency_code: feePlan?.currency_code || "",
    });

    const availablePlans = useMemo(
        () =>
            plans.filter(
                (plan) => String(plan.planable_id) === String(data.club_id)
            ),
        [plans, data.club_id]
    );

    useEffect(() => {
        if (!data.club_id) {
            if (data.plan_id !== "") {
                setData("plan_id", "");
            }
            return;
        }

        const exists = availablePlans.some(
            (plan) => String(plan.id) === data.plan_id
        );
        if (!exists && data.plan_id !== "") {
            setData("plan_id", "");
        }
    }, [data.club_id, availablePlans, data.plan_id, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("organization.students.update", student.id));
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
                    {/* Required: Club */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Select Club <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={String(data.club_id) || ""}
                            onValueChange={(value) => setData("club_id", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Club" />
                            </SelectTrigger>
                            <SelectContent>
                                {clubs.map((club) => (
                                    <SelectItem
                                        key={club.id}
                                        value={String(club.id)}
                                    >
                                        {club.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {renderError("club_id")}
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

                    {/* Plan Assignment */}
                    <div className="w-full px-2 mt-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Plan Assignment
                        </h3>
                        {!data.club_id && (
                            <p className="text-sm text-muted-foreground mb-2">
                                Select a club to view its available plans.
                            </p>
                        )}
                    </div>

                    {/* Plan Select */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Plan <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={data.plan_id}
                            onValueChange={(value) => setData("plan_id", value)}
                            disabled={
                                !data.club_id || availablePlans.length === 0
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePlans.length === 0 ? (
                                    <SelectItem value="no-plans" disabled>
                                        {data.club_id
                                            ? "No active plans for this club"
                                            : "Select a club first"}
                                    </SelectItem>
                                ) : (
                                    availablePlans.map((plan) => (
                                        <SelectItem
                                            key={plan.id}
                                            value={String(plan.id)}
                                        >
                                            {plan.name} - {plan.currency_code}{" "}
                                            {plan.base_amount}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {renderError("plan_id")}
                    </div>

                    {/* Interval */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>
                            Interval <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={data.interval}
                            onValueChange={(value) =>
                                setData("interval", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Interval" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">
                                    Quarterly
                                </SelectItem>
                                <SelectItem value="semester">
                                    Semester
                                </SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                        {renderError("interval")}
                    </div>

                    {/* Interval Count */}
                    {data.interval === "custom" && (
                        <div className="w-[33.33%] px-2 mt-3">
                            <Label>
                                Interval Count (Months){" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                min="1"
                                placeholder="Enter number of months"
                                value={data.interval_count ?? ""}
                                onChange={(e) =>
                                    setData(
                                        "interval_count",
                                        e.target.value
                                            ? parseInt(e.target.value)
                                            : null
                                    )
                                }
                            />
                            {renderError("interval_count")}
                        </div>
                    )}

                    {/* Discount Type */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Discount Type</Label>
                        <Select
                            value={data.discount_type || "none"}
                            onValueChange={(value) =>
                                setData(
                                    "discount_type",
                                    value === "none"
                                        ? ""
                                        : (value as "percent" | "fixed")
                                )
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Discount Type (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="percent">
                                    Percentage
                                </SelectItem>
                                <SelectItem value="fixed">
                                    Fixed Amount
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {renderError("discount_type")}
                    </div>

                    {/* Discount Value */}
                    {data.discount_type && (
                        <div className="w-[33.33%] px-2 mt-3">
                            <Label>
                                Discount Value{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder={
                                    data.discount_type === "percent"
                                        ? "Enter percentage"
                                        : "Enter amount"
                                }
                                value={data.discount_value ?? ""}
                                onChange={(e) =>
                                    setData(
                                        "discount_value",
                                        e.target.value
                                            ? parseFloat(e.target.value)
                                            : null
                                    )
                                }
                            />
                            {renderError("discount_value")}
                        </div>
                    )}

                    {/* Currency Override */}
                    <div className="w-[33.33%] px-2 mt-3">
                        <Label>Currency</Label>
                        <Select
                            value={data.currency_code || "default"}
                            onValueChange={(value) =>
                                setData(
                                    "currency_code",
                                    value === "default" ? "" : value
                                )
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Currency (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">
                                    Use Plan Currency
                                </SelectItem>
                                {currencies.map((currency) => (
                                    <SelectItem
                                        key={currency.code}
                                        value={currency.code}
                                    >
                                        {currency.code} - {currency.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {renderError("currency_code")}
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
                        <Label>Upload Identification Document</Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData(
                                    "identification_document",
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Please upload ID card and Passport together in a
                            single PDF file (Maximum file size: 2 MB).
                        </p>
                        {renderError("identification_document")}
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
