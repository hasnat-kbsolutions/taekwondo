"use client";

import * as React from "react";
import {
    Command,
    Frame,
    Home,
    LifeBuoy,
    Send,
    SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        // {
        //     title: "Location",
        //     url: "/locations",
        //     icon: Home,
        // },

        {
            title: "Management",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "Clubs",
                    url: "/clubs",
                },
                {
                    title: "Students",
                    url: "/students",
                },
                {
                    title: "Supporters",
                    url: "/supporters",
                },
            ],
        },

        {
            title: "Branches",
            url: "/branches",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/branches",
                },
                {
                    title: "Create",
                    url: "/branches/create",
                },
            ],
        },
        {
            title: "Ahli Gabungan",
            url: "/organizations",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/organizations",
                },
                {
                    title: "Create",
                    url: "/organizations/create",
                },
            ],
        },
        // {
        //     title: "Clubs",
        //     url: "/clubs",
        //     icon: SquareTerminal,
        //     isActive: false,
        //     items: [
        //         {
        //             title: "List",
        //             url: "/clubs",
        //         },
        //         {
        //             title: "Create",
        //             url: "/clubs/create",
        //         },
        //     ],
        // },
        // {
        //     title: "Supporters",
        //     url: "/supporters",
        //     icon: SquareTerminal,
        //     isActive: false,
        //     items: [
        //         {
        //             title: "List",
        //             url: "/supporters",
        //         },
        //         {
        //             title: "Create",
        //             url: "/supporters/create",
        //         },
        //     ],
        // },
        // {
        //     title: "Students",
        //     url: "/students",
        //     icon: SquareTerminal,
        //     isActive: false,
        //     items: [
        //         {
        //             title: "List",
        //             url: "/students",
        //         },
        //         {
        //             title: "Create",
        //             url: "/students/create",
        //         },
        //     ],
        // },
        {
            title: "Attendance",
            url: "/attendances",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/attendances",
                },
                {
                    title: "Create",
                    url: "/attendances/create",
                },
            ],
        },
        {
            title: "Payment",
            url: "/payments",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "Payments",
                    url: "/payments",
                },
                // {
                //     title: "Create",
                //     url: "/payments/create",
                // },
            ],
        },
        {
            title: "Online Exams",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "Exam Result",
                    url: "#",
                },
                {
                    title: "Sport Data",
                    url: "#",
                },
            ],
        },
        {
            title: "Role",
            url: "/roles",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/roles",
                },
                {
                    title: "Create",
                    url: "/roles/create",
                },
            ],
        },
        // {
        //     title: "Design Engineering",
        //     url: "#",
        //     icon: Frame,
        // },
        {
            title: "Reporting",
            url: "#",
            icon: Home,
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route("dashboard")}>
                                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div> */}
                                <img
                                    src="public/assets/images/logo.jpg"
                                    alt=""
                                    width="30%"
                                />

                                <div className="grid flex-1 text-left text-sm leading-tight ">
                                    <span className="truncate font-semibold">
                                        MTF
                                    </span>
                                    <span className="truncate text-xs ">
                                        Malaysian Taekwon-Do <br /> Federation
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
