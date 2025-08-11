import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Phone, Mail, Globe, Users } from 'lucide-react';

interface Organization {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    city: string;
    country: string;
    street: string;
    postal_code: string;
    status: string;
    clubs?: Array<{
        id: number;
        name: string;
    }>;
    instructors?: Array<{
        id: number;
        name: string;
    }>;
    students?: Array<{
        id: number;
        name: string;
    }>;
}

interface Props {
    organization: Organization;
}

export default function ShowOrganization({ organization }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Organization Profile" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Organization Profile</h2>
                                <Badge variant={organization.status === 'active' ? 'default' : 'secondary'}>
                                    {organization.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Name</label>
                                            <p className="text-lg font-semibold">{organization.name}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Email</label>
                                                <p className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    {organization.email}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                                <p className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    {organization.phone}
                                                </p>
                                            </div>
                                        </div>

                                        {organization.website && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Website</label>
                                                <p className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4" />
                                                    <a 
                                                        href={organization.website} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {organization.website}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
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
                                            <label className="text-sm font-medium text-gray-500">Street</label>
                                            <p>{organization.street}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">City</label>
                                                <p>{organization.city}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Postal Code</label>
                                                <p>{organization.postal_code}</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Country</label>
                                            <p>{organization.country}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Organization Statistics
                                        </CardTitle>
                                        <CardDescription>
                                            Overview of clubs, instructors, and students
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">{organization.clubs?.length || 0}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Clubs</div>
                                            </div>
                                            
                                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">{organization.instructors?.length || 0}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Instructors</div>
                                            </div>
                                            
                                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">{organization.students?.length || 0}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
                                            </div>
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
