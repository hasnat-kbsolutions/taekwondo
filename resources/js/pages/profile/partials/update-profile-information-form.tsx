import { usePage, Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileUpdate() {
    const { auth } = usePage<PageProps>().props;

    // Early return if user is not logged in (defensive programming)
    if (!auth.user) {
        return (
            <AuthenticatedLayout header="Profile">
                <Head title="Profile" />
                <div className="container mx-auto py-10">
                    <p className="text-red-500">User not authenticated.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: auth.user.name,
            email: auth.user.email,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <AuthenticatedLayout header="Update Profile">
            <Head title="Profile" />
            <div className="container mx-auto py-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Save
                    </Button>

                    {recentlySuccessful && (
                        <p className="text-green-500 text-sm mt-2">
                            Profile updated!
                        </p>
                    )}
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
