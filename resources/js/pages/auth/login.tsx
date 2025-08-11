import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
    Users,
    Building2,
    GraduationCap,
    UserCheck,
    Moon,
    Sun,
    LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";

const roles = [
    {
        id: "admin",
        name: "Admin",
        description: "System administrator with full access",
        icon: Shield,
        route: "/admin/login",
    },
    {
        id: "organization",
        name: "Organization",
        description: "Organization management and oversight",
        icon: Building2,
        route: "/organization/login",
    },
    {
        id: "club",
        name: "Club",
        description: "Club management and operations",
        icon: Users,
        route: "/club/login",
    },
    {
        id: "instructor",
        name: "Instructor",
        description: "Teaching and student management",
        icon: GraduationCap,
        route: "/instructor/login",
    },
    {
        id: "student",
        name: "Student",
        description: "Student access and learning",
        icon: UserCheck,
        route: "/student/login",
    },
];

export default function Login() {
    const { theme, setTheme } = useTheme();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const handleRoleSelect = (roleId: string) => {
        setSelectedRole(roleId);
        const role = roles.find((r) => r.id === roleId);
        if (role) {
            window.location.href = role.route;
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleLogout = () => {
        // Clear any existing session and redirect to login
        window.location.href = "/logout";
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[hsl(240,10%,3.9%)] dark:to-[hsl(240,10%,3.9%)] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                {/* Theme Toggle */}
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
                        onClick={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                        }
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
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-400 dark:to-gray-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                            <img
                                src="/assets/images/logo.jpg"
                                alt="Taekwondo Logo"
                                className="h-full w-full object-cover rounded-full"
                            />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Welcome to Taekwondo
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Please select your role to continue
                        </p>
                    </div>

                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-[hsl(240,10%,3.9%)]/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                Select Your Role
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                Choose the role that best describes your
                                position in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 px-6 pb-6">
                            {roles.map((role, index) => {
                                const IconComponent = role.icon;
                                return (
                                    <div key={role.id}>
                                        <Button
                                            variant="ghost"
                                            className="w-full h-auto p-4 justify-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 group"
                                            onClick={() =>
                                                handleRoleSelect(role.id)
                                            }
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gray-600 dark:bg-gray-800 flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-md">
                                                <IconComponent className="w-6 h-6 text-white dark:text-white" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                                    {role.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-500">
                                                    {role.description}
                                                </div>
                                            </div>
                                        </Button>
                                        {index < roles.length - 1 && (
                                            <Separator className="my-2" />
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            Need help? Contact your system administrator
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
