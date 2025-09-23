import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { Bell, User, LogOut } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { fetchNotifications, getUnreadCount, markAllRead } from "@/lib/notifications"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(true)
  }

  const handleUserClick = () => {
    setIsUserOpen(true)
  }

  const goToProfile = () => {
    setIsUserOpen(false)
    navigate("/settings")
  }

  const goToSettings = () => {
    setIsUserOpen(false)
    navigate("/settings")
  }

  const handleSignOut = () => {
    setIsUserOpen(false)
    logout()
    navigate("/login", { replace: true })
  }

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  })
  const unread = getUnreadCount(notifications)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 card-shadow z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div>
                <h1 className="font-semibold text-lg text-foreground">CONFIX</h1>
                <p className="text-sm text-muted-foreground">PROPERTY MANAGEMENT</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative" onClick={async () => { handleNotificationsClick(); await markAllRead(); await refetch(); }}>
                <Bell className="w-5 h-5" />
                {unread > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleUserClick}>
                <User className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>

          {/* Notifications Dialog */}
          <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
                <DialogDescription>Recent activity and alerts</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 max-h-[60vh] overflow-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                    <span className={`mt-1 h-2 w-2 rounded-full ${n.color === 'green' ? 'bg-green-500' : n.color === 'blue' ? 'bg-blue-500' : n.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      {n.description && <p className="text-xs text-muted-foreground">{n.description}</p>}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-sm text-muted-foreground">You're all caught up.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* User Dialog */}
          <Dialog open={isUserOpen} onOpenChange={setIsUserOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Account</DialogTitle>
                <DialogDescription>Manage your profile and settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="secondary" onClick={goToProfile}>View Profile</Button>
                <Button className="w-full justify-start" variant="secondary" onClick={goToSettings}>Settings</Button>
                <Button className="w-full justify-start" variant="destructive" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SidebarProvider>
  )
}