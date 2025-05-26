import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    companies: any[];
    organizations: any[];
    clubs: any[];
}

export default function Create({ companies, organizations, clubs }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: "",
        country: "",
        organization_id: "",
        club_id: "",
        name: "",
        surename: "",
        gender: "",
        email: "",
        phone: "",
        type: "",
        status: false,
        profile_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("supporters.store"), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Create Supporter">
            <Head title="Create Supporter" />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Supporter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-wrap">
                            <div className="w-[50%] px-2">
                                <Label className="block text-sm mb-1">
                                    Select Company </Label>
                                <select
                                    value={data.company_id}
                                    onChange={(e) =>
                                        setData("company_id", e.target.value)
                                    }
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">Select Company</option>
                                    {companies.map((company) => (
                                        <option
                                            key={company.id}
                                            value={company.id}
                                        >
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.company_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.company_id}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2">
                                <Label className="block text-sm mb-1">
                                    Select organization </Label>
                                <select
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
                                </select>
                                {errors.organization_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.organization_id}
                                    </p>
                                )}
                            </div>

                            <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                    Select Club </Label>
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
                                    Name </Label>
                                    <Input type="name"
                                        placeholder="Name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                            </div>

                             <div className="w-[50%] px-2 mt-3">
                                <Label className="block text-sm mb-1">
                                     Surename </Label>           
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
                                     Country </Label>         
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
                                     Gender</Label>  
                                      <Select  placeholder="Gender"
                                        value={data.gender}
                                        onChange={(e) =>
                                            setData("gender", e.target.value)
                                        }>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Gender</SelectLabel>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                        </Select>
                                    </div>


                                    <div className="w-[50%] px-2 mt-3">
                                         <Label className="block text-sm mb-1">
                                            Email </Label>
                                        <Input type="email"
                                            placeholder="Email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                </div>

                              <div className="w-[50%] px-2 mt-3">
                                      <Label className="block text-sm mb-1">
                                            Phone </Label>             
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
                                            Type </Label>                        
                            <Input type="text"
                                placeholder="Type"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                            />
                            </div>

                        
                         <div className="w-full px-2 mt-3">
                                      <Label className="block text-sm mb-1">
                                            Files </Label>   
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
                                        Create
                                    </Button>
                              </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
