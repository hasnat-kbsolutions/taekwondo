import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building2, MapPin, Phone, Mail, Calendar } from 'lucide-react';

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postal_code: string;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    club?: {
        id: number;
        name: string;
    };
    organization?: {
        id: number;
        name: string;
    };
}

interface Props {
    student: Student;
}

export default function ShowStudent({ student }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Student Profile" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Student Profile</h2>
                                <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                                    {student.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                                            <p className="text-lg font-semibold">{student.first_name} {student.last_name}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Email</label>
                                            <p className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                {student.user.email}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Phone</label>
                                            <p className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {student.phone}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                            <p className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {student.date_of_birth}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Address Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Address</label>
                                            <p>{student.address}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">City</label>
                                                <p>{student.city}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Postal Code</label>
                                                <p>{student.postal_code}</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Country</label>
                                            <p>{student.country}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5" />
                                            Organization Details
                                        </CardTitle>
                                        <CardDescription>
                                            Student's club and organization information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {student.club && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Club</label>
                                                    <p className="text-lg font-semibold text-blue-600">{student.club.name}</p>
                                                </div>
                                            )}
                                            
                                            {student.organization && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Organization</label>
                                                    <p className="text-lg font-semibold text-green-600">{student.organization.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
