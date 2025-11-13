"use client";

import * as React from "react";
import {
    Frame,
    Home,
    LifeBuoy,
    Send,
    SquareTerminal,
    Star,
    Calendar,
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

import { LucideIcon } from "lucide-react";

type NavItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
};

const NAV_MENUS: Record<string, NavItem[]> = {
    admin: [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: Home,
        },
        {
            title: "Management",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                { title: "Students", url: "/admin/students" },
                { title: "Supporters", url: "/admin/supporters" },
                { title: "Instructors", url: "/admin/instructors" },
            ],
        },
        {
            title: "Clubs",
            url: "/admin/clubs",
            icon: SquareTerminal,
            isActive: false,
            items: [
                { title: "List", url: "/admin/clubs" },
                { title: "Create", url: "/admin/clubs/create" },
            ],
        },
        {
            title: "Ahli Gabungan",
            url: "/admin/organizations",
            icon: SquareTerminal,
            isActive: false,
            items: [
                { title: "List", url: "/admin/organizations" },
                { title: "Create", url: "/admin/organizations/create" },
            ],
        },
        {
            title: "Attendance",
            url: "/admin/attendances",
            icon: SquareTerminal,
            isActive: false,
            items: [
                { title: "List", url: "/admin/attendances" },
                { title: "Create", url: "/admin/attendances/create" },
            ],
        },
        {
            title: "Payment",
            url: "/admin/payments",
            icon: SquareTerminal,
            isActive: false,
            items: [
                { title: "Payments", url: "/admin/payments" },
                { title: "Fee Types", url: "/admin/fee-types" },
                { title: "Student Fees", url: "/admin/student-fees" },
            ],
        },
        {
            title: "Certifications",
            url: "/admin/certifications",
            icon: SquareTerminal,
            isActive: false,
            items: [{ title: "Certifications", url: "/admin/certifications" }],
        },
        {
            title: "Online Exams",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                { title: "Exam Result", url: "#" },
                { title: "Sport Data", url: "#" },
            ],
        },
        // {
        //     title: "Role",
        //     url: "/admin/roles",
        //     icon: SquareTerminal,
        //     isActive: false,
        //     items: [
        //         { title: "List", url: "/admin/roles" },
        //         { title: "Create", url: "/admin/roles/create" },
        //     ],
        // },
        {
            title: "Reports",
            url: "/admin/reports",
            icon: SquareTerminal,
        },
        {
            title: "Bank Information",
            url: "/admin/bank-information",
            icon: SquareTerminal,
        },
        {
            title: "Settings",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [{ title: "Currencies", url: "/admin/currencies" }],
        },
    ],

    organization: [
        { title: "Dashboard", url: "/organization/dashboard", icon: Home },
        {
            title: "Clubs",
            url: "/organization/clubs",
            icon: SquareTerminal,
        },
        {
            title: "Students",
            url: "/organization/students",
            icon: SquareTerminal,
        },
        {
            title: "Payments",
            url: "/organization/payments",
            icon: SquareTerminal,
        },
        {
            title: "Attendance",
            url: "/organization/attendances",
            icon: SquareTerminal,
        },
        {
            title: "Instructor",
            url: "/organization/instructors",
            icon: SquareTerminal,
        },
        {
            title: "Certifications",
            url: "/organization/certifications",
            icon: SquareTerminal,
        },
        {
            title: "Ratings",
            url: "/organization/ratings",
            icon: Star,
        },
        {
            title: "Bank Information",
            url: "/organization/bank-information",
            icon: SquareTerminal,
        },
    ],

    club: [
        { title: "Dashboard", url: "/club/dashboard", icon: Home },

        {
            title: "Students",
            url: "/club/students",
            icon: SquareTerminal,
        },
        {
            title: "Payments",
            url: "/club/payments",
            icon: SquareTerminal,
        },
        {
            title: "Attendance",
            url: "/club/attendances",
            icon: SquareTerminal,
        },
        {
            title: "Instructor",
            url: "/club/instructors",
            icon: SquareTerminal,
        },
        {
            title: "Certifications",
            url: "/club/certifications",
            icon: SquareTerminal,
        },
        {
            title: "Ratings",
            url: "/club/ratings",
            icon: Star,
        },
        {
            title: "Events",
            url: "/club/events",
            icon: Calendar,
        },
        {
            title: "Bank Information",
            url: "/club/bank-information",
            icon: SquareTerminal,
        },
    ],

    student: [
        { title: "Dashboard", url: "/student/dashboard", icon: Home },
        { title: "Payment", url: "/student/payments", icon: Home },
        { title: "Attendence", url: "/student/attendances", icon: Home },
        {
            title: "Certifications",
            url: "/student/certifications",
            icon: SquareTerminal,
        },
        {
            title: "Events",
            url: "/student/events",
            icon: Calendar,
        },
        {
            title: "Profile",
            url: "/student/profile",
            icon: SquareTerminal,
        },
        {
            title: "Ratings",
            url: "/student/ratings",
            icon: SquareTerminal,
        },
    ],

    instructor: [
        { title: "Dashboard", url: "/instructor/dashboard", icon: Home },
        {
            title: "Students",
            url: "/instructor/students",
            icon: SquareTerminal,
        },
        {
            title: "Attendances",
            url: "/instructor/attendances",
            icon: SquareTerminal,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;
    const role = (auth.user?.role ?? "student") as keyof typeof NAV_MENUS;

    // Type assertion for userable
    const user = auth.user as any;

    const navMain = NAV_MENUS[role];

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route(`${role}.dashboard`)}>
                                {" "}
                                {/* Use route based on role */}
                                {user?.userable?.logo ? (
                                    <img
                                        src={
                                            user.userable.logo.startsWith(
                                                "http"
                                            )
                                                ? user.userable.logo
                                                : `/storage/${user.userable.logo}`
                                        }
                                        alt={user.userable.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">
                                            {user?.userable?.name?.charAt(0) ||
                                                "M"}
                                        </span>
                                    </div>
                                )}
                                <div className="grid flex-1 text-left text-sm leading-tight ">
                                    <span className="truncate font-semibold">
                                        {user?.userable?.name || "MTF"}
                                    </span>
                                    <span className="truncate text-xs ">
                                        {user?.userable?.type === "Organization"
                                            ? "Organization"
                                            : user?.userable?.type === "Club"
                                            ? "Club"
                                            : "Malaysian Taekwon-Do Federation"}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
                {/* <NavSecondary
                    items={[
                        { title: "Support", url: "#", icon: LifeBuoy },
                        { title: "Feedback", url: "#", icon: Send },
                    ]}
                    className="mt-auto"
                /> */}
            </SidebarContent>
            <SidebarFooter>
                {auth.user && <NavUser user={auth.user} />}
            </SidebarFooter>
        </Sidebar>
    );
}
