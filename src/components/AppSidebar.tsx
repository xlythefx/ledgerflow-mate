import { LayoutDashboard, ArrowLeftRight, BarChart3, Bell, ExternalLink, Receipt, FileText, LogOut, Repeat } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL || "https://app.company.com";

const navItems = [
  { title: "Transactions", url: "/", icon: Receipt },
  { title: "Reconciliation", url: "/reconciliation", icon: ArrowLeftRight },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Subscriptions", url: "/subscriptions", icon: Repeat },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, loading } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">CashFlow</p>
                  <p className="text-xs text-muted-foreground">Finance Dashboard</p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
                <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent/50"
                      activeClassName="bg-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-3">
        {/* User Profile */}
        <div className="flex items-center gap-2.5 px-1">
          {loading ? (
            <>
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              {!collapsed && <Skeleton className="h-4 w-24" />}
            </>
          ) : user ? (
            <>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
                <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Return to Main App */}
        <a
          href={MAIN_APP_URL}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && <span>Return to Main App</span>}
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
