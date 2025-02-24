import {
    IconBrowserCheck,
    IconNotification,
    IconPalette,
    IconTool,
    IconUser,
  } from "@tabler/icons-react";
  import { Separator } from "@/components/ui/separator";
import { ProfileDropdown } from "@/components/AdminDashboard/AdminDashboardComponents/ProfileDropdown";
import SidebarNav from "@/components/AdminDashboard/Features/Settings/components/SettingsSidebarNav";
import { Search } from "@/components/AdminDashboard/AdminDashboardComponents/Search";
import { ModeToggle } from "@/components/AdminDashboard/AdminDashboardComponents/ModeToggle";
import { Header } from "@/components/AdminDashboard/AdminDashboard_Layout/Header";
import { Main } from "@/components/AdminDashboard/AdminDashboard_Layout/Main";
  
  const sidebarNavItems = [
    {
      title: "Profile",
      icon: <IconUser size={18} />,
      href: "/dashboard/settings/profile",
    },
    {
      title: "Account",
      icon: <IconTool size={18} />,
      href: "/dashboard/settings/account",
    },
    {
      title: "Appearance",
      icon: <IconPalette size={18} />,
      href: "/dashboard/settings/appearance",
    },
    {
      title: "Notifications",
      icon: <IconNotification size={18} />,
      href: "/dashboard/settings/notifications",
    },
    {
      title: "Display",
      icon: <IconBrowserCheck size={18} />,
      href: "/dashboard/settings/display",
    },
  ];
  
  export default function SettingsLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        {/* ===== Top Heading ===== */}
        <Header>
          <Search />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <ProfileDropdown />
          </div>
        </Header>
  
        <Main fixed>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <Separator className="my-4 lg:my-6" />
          <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="top-0 lg:sticky lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex w-full overflow-y-hidden p-1 pr-4">
              {children}
            </div>
          </div>
        </Main>
      </>
    );
  }