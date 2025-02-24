// types/sidebar.ts
import { Route } from 'next';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

// For type-safe routing in Next.js
type NavLink = BaseNavItem & {
  // Route type ensures type-safe routing for app directory
  url: Route;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: Route })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarData {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
}

// For more specific typing with dynamic routes
type DynamicRoute<T extends string> = Route<T>;

// Helper type for external URLs
type ExternalLink = `https://${string}` | `http://${string}`;

// Combined URL type that can handle both internal and external links
type NavigationUrl = Route | ExternalLink;

// Enhanced NavLink with support for both internal and external URLs
type EnhancedNavLink = BaseNavItem & {
  url: NavigationUrl;
  isExternal?: boolean;
  items?: never;
};

export type {
  SidebarData,
  NavGroup,
  NavItem,
  NavCollapsible,
  NavLink,
  DynamicRoute,
  EnhancedNavLink,
  NavigationUrl,
  User,
  Team
};

// Example usage:
/*
const navItems: NavGroup = {
  title: "Main",
  items: [
    {
      title: "Dashboard",
      url: "/dashboard", // Type-safe route
      icon: DashboardIcon
    },
    {
      title: "Settings",
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
          icon: ProfileIcon
        }
      ]
    }
  ]
};

// With dynamic routes
const dynamicRoute: DynamicRoute<"/users/[id]"> = "/users/[id]";

// With external links
const enhancedNav: EnhancedNavLink = {
  title: "External",
  url: "https://example.com",
  isExternal: true
};
*/