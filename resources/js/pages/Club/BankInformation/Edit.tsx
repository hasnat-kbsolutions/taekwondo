import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BankInformation {
    id: number;
    bank_name: string;
    account_name: string;
    account_number: string;
    iban?: string;
    swift_code?: string;
    branch?: string;
    currency: string;
    userable_type: string;
    userable_id: number;
    userable?: {
        id: number;
        name: string;
    };
}

interface Currency {
    id: number;
    code: string;
    name: string;
}

interface Props {
    bankInformation: BankInformation;
    currencies: Currency[];
}

export default function Edit({ bankInformation, currencies }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        bank_name: bankInformation.bank_name,
        account_name: bankInformation.account_name,
        account_number: bankInformation.account_number,
        iban: bankInformation.iban || "",
        swift_code: bankInformation.swift_code || "",
        branch: bankInformation.branch || "",
        currency: bankInformation.currency,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("club.bank-information.update", bankInformation.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Bank Information" />
            <div className="p-4 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Bank Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="bank_name">
                                        Bank Name *
                                    </Label>
                                    <Input
                                        id="bank_name"
                                        value={data.bank_name}
                                        onChange={(e) =>
                                            setData("bank_name", e.target.value)
                                        }
                                        className={
                                            errors.bank_name
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.bank_name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.bank_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="account_name">
                                        Account Name *
                                    </Label>
                                    <Input
                                        id="account_name"
                                        value={data.account_name}
                                        onChange={(e) =>
                                            setData(
                                                "account_name",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.account_name
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.account_name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.account_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="account_number">
                                        Account Number *
                                    </Label>
                                    <Input
                                        id="account_number"
                                        value={data.account_number}
                                        onChange={(e) =>
                                            setData(
                                                "account_number",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.account_number
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.account_number && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.account_number}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="currency">Currency *</Label>
                                    <Select
                                        value={data.currency}
                                        onValueChange={(value) =>
                                            setData("currency", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((currency) => (
                                                <SelectItem
                                                    key={currency.id}
                                                    value={currency.code}
                                                >
                                                    {currency.code} -{" "}
                                                    {currency.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.currency && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.currency}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="iban">IBAN</Label>
                                    <Input
                                        id="iban"
                                        value={data.iban}
                                        onChange={(e) =>
                                            setData("iban", e.target.value)
                                        }
                                        className={
                                            errors.iban ? "border-red-500" : ""
                                        }
                                    />
                                    {errors.iban && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.iban}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="swift_code">
                                        SWIFT Code
                                    </Label>
                                    <Input
                                        id="swift_code"
                                        value={data.swift_code}
                                        onChange={(e) =>
                                            setData(
                                                "swift_code",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.swift_code
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.swift_code && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.swift_code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="branch">Branch</Label>
                                <Input
                                    id="branch"
                                    value={data.branch}
                                    onChange={(e) =>
                                        setData("branch", e.target.value)
                                    }
                                    className={
                                        errors.branch ? "border-red-500" : ""
                                    }
                                />
                                {errors.branch && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.branch}
                                    </p>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Updating..."
                                        : "Update Bank Information"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
