"use client"

import * as React from "react"
import {
  Command,
  Frame, Home,
  LifeBuoy,
  Send,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Link, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";

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
            title: "Companies",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/companies",
                },
                {
                    title: "Create",
                    url: "/companies/create",
                },
            ],
        },
        {
            title: "Organizations",
            url: "#",
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
        {
            title: "Clubs",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/clubs",
                },
                {
                    title: "Create",
                    url: "/clubs/create",
                },
            ],
        },
        {
            title: "Supporters",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/supporters",
                },
                {
                    title: "Create",
                    url: "/supporters/create",
                },
            ],
        },
        {
            title: "Students",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/students",
                },
                {
                    title: "Create",
                    url: "/students/create",
                },
            ],
        },
        {
            title: "Attendance",
            url: "#",
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
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: "/payments",
                },
                {
                    title: "Create",
                    url: "/payments/create",
                },
            ],
        },
        {
            title: "Role",
            url: "#",
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
        {
            title: "Design Engineering",
            url: "#",
            icon: Frame,
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
              <Link href={route('dashboard')}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
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
  )
}
