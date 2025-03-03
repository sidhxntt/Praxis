import {
  IconBrowserCheck,
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
  IconPackages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
} from "@tabler/icons-react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

export const sidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconLayoutDashboard,
        },
        {
          title: "Tasks",
          url: "/dashboard/tasks",
          icon: IconChecklist,
        },
        {
          title: "Apps",
          url: "/dashboard/apps",
          icon: IconPackages,
        },
        {
          title: "Users",
          url: "/dashboard/users",
          icon: IconUsers,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: IconSettings,
          items: [
            {
              title: "Profile",
              url: "/dashboard/settings/profile",
              icon: IconUserCog,
            },
            {
              title: "Account",
              url: "/dashboard/settings/account",
              icon: IconTool,
            },
            {
              title: "Appearance",
              url: "/dashboard/settings/appearance",
              icon: IconPalette,
            },
            {
              title: "Notifications",
              url: "/dashboard/settings/notifications",
              icon: IconNotification,
            },
            {
              title: "Display",
              url: "/dashboard/settings/display",
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: "Help Center",
          url: "/dashboard/help-center",
          icon: IconHelp,
        },
      ],
    },
  ],
};
