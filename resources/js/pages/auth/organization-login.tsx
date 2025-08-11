import { FormEventHandler, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputError } from "@/components/ui/input-error";
import { Shield, ArrowLeft, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";

export default function OrganizationLogin({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { theme, setTheme } = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("organization.login"));
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
            <Head title="Organization Login" />
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
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-400 dark:to-gray-500 rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                            <img
                                src="/assets/images/logo.jpg"
                                alt="Organization Logo"
                                className="h-full w-full object-cover rounded-full"
                            />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Organization Login
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Access the organization dashboard
                        </p>
                    </div>

                    {/* Theme Toggle */}

                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-[hsl(240,10%,3.9%)]/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                Sign in to Organization Panel
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-gray-300">
                                Enter your organization credentials to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <form onSubmit={submit} className="space-y-6">
                                {status && (
                                    <div className="mb-4 p-3 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                        {status}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="organization@example.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                        className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600 focus:ring-gray-400 dark:focus:ring-gray-600 bg-white dark:bg-[hsl(240,10%,3.9%)] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-gray-700 dark:text-gray-300 font-medium"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <Link
                                                href={route("password.request")}
                                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 underline hover:no-underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                        className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600 focus:ring-gray-400 dark:focus:ring-gray-600 bg-white dark:bg-[hsl(240,10%,3.9%)] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gray-700 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Signing in..."
                                        : "Sign in to Organization Panel"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="text-center space-y-2">
                        <div className="text-sm">
                            <Link
                                href="/login"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 inline-flex items-center transition-colors duration-200"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Role Selection
                            </Link>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Need help? Contact your system administrator
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
