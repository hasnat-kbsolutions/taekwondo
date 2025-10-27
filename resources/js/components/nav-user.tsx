"use client";

import {
    BadgeCheck,
    ChevronsUpDown,
    LogOut,
    Building2,
    Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/types";
import { Link } from "@inertiajs/react";

export function NavUser({ user }: { user: User }) {
    const { isMobile } = useSidebar();
    const role = user.role || "student";

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                                <AvatarFallback className="rounded-lg">
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                                    <AvatarFallback className="rounded-lg">
                                        AC
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {/* Hide Edit Profile option for admin */}
                            {role !== "admin" && (
                                <DropdownMenuItem asChild>
                                    <Link href={route(`${role}.profile.show`)}>
                                        <BadgeCheck />
                                        View Profile
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            {/* Additional Profile Links for Different Roles */}

                            {role === "branch" && (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href={route("club.profile.show")}>
                                            <Building2 />
                                            Club Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route(
                                                "organization.profile.show"
                                            )}
                                        >
                                            <Users />
                                            Organization Profile
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link
                                className="w-full"
                                href={route("logout")}
                                method={"post"}
                                as={"button"}
                            >
                                <LogOut />
                                Log out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
