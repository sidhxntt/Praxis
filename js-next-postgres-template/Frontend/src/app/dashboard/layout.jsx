"use client";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SearchProvider } from "@/Context/SearchContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AdminDashboard/AdminDashboard_Layout/AppSidebar";
import SkipToMain from "@/components/AdminDashboard/AdminDashboardComponents/SkipToMain";

export default function DashboardLayout({ children }) {
  const defaultOpen = Cookies.get("sidebar:state") !== "false";

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id="content"
          className={cn(
            "ml-auto w-full max-w-full",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "transition-[width] duration-200 ease-linear",
            "flex h-svh flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh"
          )}
        >
          {children}
          <Toaster />
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
}
