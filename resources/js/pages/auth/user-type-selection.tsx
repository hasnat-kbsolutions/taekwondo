import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Moon,
    Sun,
    Shield,
    Users,
    Building2,
    GraduationCap,
    UserCheck,
    ArrowRight,
    LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";

interface Role {
    name: string;
    display_name: string;
    description: string;
    icon: React.ReactNode;
    route: string;
}

const roles: Role[] = [
    {
        name: "admin",
        display_name: "Administrator",
        description: "Full system access and management",
        icon: <Shield className="h-6 w-6" />,
        route: "/admin/login",
    },
    {
        name: "organization",
        display_name: "Organization",
        description: "Manage multiple clubs and locations",
        icon: <Building2 className="h-6 w-6" />,
        route: "/organization/login",
    },
    {
        name: "club",
        display_name: "Club",
        description: "Manage club operations and students",
        icon: <Users className="h-6 w-6" />,
        route: "/club/login",
    },
    {
        name: "instructor",
        display_name: "Instructor",
        description: "Teach and manage students",
        icon: <GraduationCap className="h-6 w-6" />,
        route: "/instructor/login",
    },
    {
        name: "student",
        display_name: "Student",
        description: "Access student dashboard and features",
        icon: <UserCheck className="h-6 w-6" />,
        route: "/student/login",
    },
];

export default function UserTypeSelection() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleLogout = () => {
        // Clear any existing session and redirect to login
        window.location.href = "/logout";
    };

    return (
        <>
            <Head title="Select User Type" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[hsl(240,10%,3.9%)] dark:to-[hsl(240,10%,3.9%)] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                {/* Logout and Theme Toggle */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="h-10 w-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-slate-200 dark:border-gray-800 hover:bg-white dark:hover:bg-black shadow-lg transition-all duration-200"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5 text-slate-700 dark:text-gray-300" />
                        <span className="sr-only">Logout</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-10 w-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-slate-200 dark:border-gray-800 hover:bg-white dark:hover:bg-black shadow-lg transition-all duration-200"
                    >
                        {theme === "light" ? (
                            <Moon className="h-5 w-5 text-slate-700" />
                        ) : (
                            <Sun className="h-5 w-5 text-gray-300" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
                <div className="max-w-4xl w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-20 w-20 bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-400 dark:to-gray-500 rounded-full flex items-center justify-center mb-6 shadow-lg overflow-hidden">
                            <img
                                src="/assets/images/logo.jpg"
                                alt="Taekwondo Logo"
                                className="h-full w-full object-cover rounded-full"
                            />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                            Welcome to Taekwondo
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Select your user type to continue
                        </p>
                    </div>

                    {/* Role Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map((role) => (
                            <Card
                                key={role.name}
                                className="group cursor-pointer border-gray-200 dark:border-gray-800 bg-white dark:bg-[hsl(240,10%,3.9%)] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-800 transition-colors duration-200">
                                            {role.icon}
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                                        {role.display_name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <CardDescription className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                        {role.description}
                                    </CardDescription>
                                    <Link href={role.route}>
                                        <Button className="w-full bg-gray-700 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                                            Continue as {role.display_name}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Need help? Contact your system administrator
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
