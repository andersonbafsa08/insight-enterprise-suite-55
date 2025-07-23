
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  Building2,
  UserCheck,
  Package,
  Car,
  CreditCard,
  Settings,
  Bot,
  BarChart3,
  Shield,
  FileText,
  Home,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home, 
    modules: ["dashboard"] 
  },
  { 
    title: "Clientes", 
    url: "/clients", 
    icon: Users, 
    modules: ["clients"] 
  },
  { 
    title: "Solicitações", 
    url: "/requests", 
    icon: Building2, 
    modules: ["requests"] 
  },
  { 
    title: "Colaboradores", 
    url: "/employees", 
    icon: UserCheck, 
    modules: ["employees"] 
  },
  { 
    title: "Estoque", 
    url: "/stock", 
    icon: Package, 
    modules: ["stock"] 
  },
  { 
    title: "Frota", 
    url: "/fleet", 
    icon: Car, 
    modules: ["fleet"] 
  },
  { 
    title: "Diárias", 
    url: "/allowances", 
    icon: CreditCard, 
    modules: ["allowances"] 
  },
];

const adminItems = [
  { 
    title: "Configurações", 
    url: "/settings", 
    icon: Settings, 
    modules: ["settings"] 
  },
  { 
    title: "IA", 
    url: "/ai", 
    icon: Bot, 
    modules: ["ai"] 
  },
  { 
    title: "Relatórios", 
    url: "/reports", 
    icon: BarChart3, 
    modules: ["reports"] 
  },
];

const securityItems = [
  { 
    title: "Auditoria", 
    url: "/audit", 
    icon: Shield, 
    modules: ["settings"] 
  },
  { 
    title: "Logs", 
    url: "/logs", 
    icon: FileText, 
    modules: ["settings"] 
  },
];

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const { user, hasPermission: userHasPermission } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const hasPermission = (requiredModules: string[]) => {
    return requiredModules.some(module => 
      userHasPermission(module, "read")
    );
  };

  const getNavClassName = (itemUrl: string) => {
    const active = isActive(itemUrl);
    return active 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  };

  const filteredNavigationItems = navigationItems.filter(item => 
    hasPermission(item.modules)
  );

  const filteredAdminItems = adminItems.filter(item => 
    hasPermission(item.modules)
  );

  const filteredSecurityItems = securityItems.filter(item => 
    hasPermission(item.modules)
  );

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {(!collapsed || isMobile) && "Módulos Principais"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {filteredAdminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {(!collapsed || isMobile) && "Administração"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Security Section */}
        {filteredSecurityItems.length > 0 && user?.role === "Administrador" && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {(!collapsed || isMobile) && "Segurança"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredSecurityItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
