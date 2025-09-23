import { useState } from "react"
import { 
  Home, 
  Building2, 
  MessageSquareWarning, 
  ClipboardList, 
  BarChart3, 
  Settings,
  ChevronLeft,
  Bell,
  Search
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navigation = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Units", url: "/units", icon: Building2 },
  { title: "Complaints", url: "/complaints", icon: MessageSquareWarning },
  { title: "Requests", url: "/requests", icon: ClipboardList },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `${isActive 
      ? "bg-sidebar-accent text-sidebar-primary-foreground font-medium border-r-2 border-sidebar-primary" 
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    } transition-smooth`

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} border-r border-sidebar-border transition-smooth`}>
      <SidebarContent className="bg-sidebar-background">
        {/* Header */}
        <div className="p-5 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-4">
              <img src="/favicon.png" alt="CondoAdmin logo" className="w-12 h-12 rounded-xl ring-1 ring-sidebar-border shadow-sm object-cover" />
              <div>
                <h2 className="text-sidebar-foreground font-semibold text-base leading-tight">CondoAdmin</h2>
                <p className="text-sidebar-foreground/60 text-xs">Management Portal</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <img src="/favicon.png" alt="CondoAdmin logo" className="w-10 h-10 rounded-xl ring-1 ring-sidebar-border shadow-sm object-cover" />
            </div>
          )}
        </div>


        {/* Navigation */}
        <SidebarGroup className="flex-1 py-4">
          <SidebarGroupLabel className={`${isCollapsed ? "hidden" : ""} px-4 text-sidebar-foreground/60 text-xs font-medium uppercase tracking-wider`}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title} className="px-3">
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className={`${isCollapsed ? "mx-auto" : "mr-3"} h-5 w-5 flex-shrink-0`} />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <div className="flex-1">
                <p className="text-sidebar-foreground text-sm font-medium">Admin User</p>
                <p className="text-sidebar-foreground/60 text-xs">admin@condo.com</p>
              </div>
              <Button variant="ghost" size="sm" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}