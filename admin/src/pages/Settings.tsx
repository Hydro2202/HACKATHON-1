import { useEffect, useState } from "react"
import { Settings as SettingsIcon, User, Bell, Shield, Database, Mail, Palette, Building2 } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { loadSettings, saveSettings } from "@/lib/settings"

const Settings = () => {
  const initial = loadSettings()
  const [general, setGeneral] = useState(initial.general)
  const [notifications, setNotifications] = useState(initial.notifications)
  const [users, setUsers] = useState(initial.users)
  const [property, setProperty] = useState(initial.property)
  const [security, setSecurity] = useState(initial.security)

  useEffect(() => {
    // keep state in sync if storage changes elsewhere
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "dh_settings") {
        const s = loadSettings()
        setGeneral(s.general)
        setNotifications(s.notifications)
        setUsers(s.users)
        setProperty(s.property)
        setSecurity(s.security)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return (
    <AppLayout>
      <div className="dashboard-bg min-h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your condo management system preferences</p>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="property">Property</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <div className="grid gap-6">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5" />
                      General Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="systemName">System Name</Label>
                        <Input id="systemName" placeholder="CondoAdmin Management System" value={general.systemName} onChange={(e) => setGeneral({ ...general, systemName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={general.timezone} onValueChange={(v) => setGeneral({ ...general, timezone: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="est">Eastern Standard Time</SelectItem>
                            <SelectItem value="cst">Central Standard Time</SelectItem>
                            <SelectItem value="mst">Mountain Standard Time</SelectItem>
                            <SelectItem value="pst">Pacific Standard Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">Default Language</Label>
                        <Select value={general.language} onValueChange={(v) => setGeneral({ ...general, language: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={general.currency} onValueChange={(v) => setGeneral({ ...general, currency: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="cad">CAD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="bg-primary hover:bg-primary-dark" onClick={() => saveSettings({ general })}>
                      Save General Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notification Methods</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch 
                          id="email-notifications"
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                        </div>
                        <Switch 
                          id="sms-notifications"
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                        </div>
                        <Switch 
                          id="push-notifications"
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notification Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="complaint-notifications">New Complaints</Label>
                          <p className="text-sm text-muted-foreground">Get notified when new complaints are submitted</p>
                        </div>
                        <Switch 
                          id="complaint-notifications"
                          checked={notifications.complaints}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, complaints: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="request-notifications">New Requests</Label>
                          <p className="text-sm text-muted-foreground">Get notified when new requests are submitted</p>
                        </div>
                        <Switch 
                          id="request-notifications"
                          checked={notifications.requests}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, requests: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="maintenance-notifications">Maintenance Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about maintenance schedule changes</p>
                        </div>
                        <Switch 
                          id="maintenance-notifications"
                          checked={notifications.maintenance}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, maintenance: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-primary hover:bg-primary-dark">
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="adminName">Admin Name</Label>
                      <Input id="adminName" placeholder="Admin User" value={users.adminName} onChange={(e) => setUsers({ ...users, adminName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input id="adminEmail" type="email" placeholder="admin@condo.com" value={users.adminEmail} onChange={(e) => setUsers({ ...users, adminEmail: e.target.value })} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminRole">Role</Label>
                    <Select value={users.role} onValueChange={(v) => setUsers({ ...users, role: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="staff">Staff Member</SelectItem>
                        <SelectItem value="manager">Property Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">User Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manage-units">Manage Units</Label>
                        <Switch id="manage-units" checked={users.permissions.manageUnits} onCheckedChange={(v) => setUsers({ ...users, permissions: { ...users.permissions, manageUnits: v } })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="handle-complaints">Handle Complaints</Label>
                        <Switch id="handle-complaints" checked={users.permissions.handleComplaints} onCheckedChange={(v) => setUsers({ ...users, permissions: { ...users.permissions, handleComplaints: v } })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="approve-requests">Approve Requests</Label>
                        <Switch id="approve-requests" checked={users.permissions.approveRequests} onCheckedChange={(v) => setUsers({ ...users, permissions: { ...users.permissions, approveRequests: v } })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="generate-reports">Generate Reports</Label>
                        <Switch id="generate-reports" checked={users.permissions.generateReports} onCheckedChange={(v) => setUsers({ ...users, permissions: { ...users.permissions, generateReports: v } })} />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-primary hover:bg-primary-dark" onClick={() => saveSettings({ users })}>
                    Save User Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Property */}
            <TabsContent value="property">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="propertyName">Property Name</Label>
                      <Input id="propertyName" placeholder="Sunset Tower Condominiums" value={property.propertyName} onChange={(e) => setProperty({ ...property, propertyName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalUnits">Total Units</Label>
                      <Input id="totalUnits" type="number" placeholder="190" value={property.totalUnits} onChange={(e) => setProperty({ ...property, totalUnits: Number(e.target.value) })} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Textarea 
                      id="propertyAddress" 
                      placeholder="123 Main Street, Downtown, City, State 12345"
                      rows={3}
                      value={property.propertyAddress}
                      onChange={(e) => setProperty({ ...property, propertyAddress: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="managementCompany">Management Company</Label>
                      <Input id="managementCompany" placeholder="Property Management Co." value={property.managementCompany} onChange={(e) => setProperty({ ...property, managementCompany: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input id="emergencyContact" placeholder="(555) 123-4567" value={property.emergencyContact} onChange={(e) => setProperty({ ...property, emergencyContact: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <Textarea 
                      id="amenities" 
                      placeholder="Pool, Gym, Rooftop Deck, Parking Garage, Concierge"
                      rows={3}
                      value={property.amenities}
                      onChange={(e) => setProperty({ ...property, amenities: e.target.value })}
                    />
                  </div>

                  <Button className="bg-primary hover:bg-primary-dark" onClick={() => saveSettings({ property })}>
                    Save Property Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Password Policy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="require-complex">Require Complex Passwords</Label>
                          <p className="text-sm text-muted-foreground">Enforce uppercase, lowercase, numbers, and symbols</p>
                        </div>
                        <Switch id="require-complex" checked={security.requireComplex} onCheckedChange={(v) => setSecurity({ ...security, requireComplex: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                        </div>
                        <Switch id="two-factor" checked={security.twoFactor} onCheckedChange={(v) => setSecurity({ ...security, twoFactor: v })} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Session Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input id="sessionTimeout" type="number" placeholder="60" value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: Number(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxSessions">Max Concurrent Sessions</Label>
                        <Input id="maxSessions" type="number" placeholder="3" value={security.maxSessions} onChange={(e) => setSecurity({ ...security, maxSessions: Number(e.target.value) })} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Backup</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-backup">Automatic Daily Backups</Label>
                          <p className="text-sm text-muted-foreground">Automatically backup data every 24 hours</p>
                        </div>
                        <Switch id="auto-backup" checked={security.autoBackup} onCheckedChange={(v) => setSecurity({ ...security, autoBackup: v })} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="backupTime">Backup Time</Label>
                          <Input id="backupTime" type="time" value={security.backupTime} onChange={(e) => setSecurity({ ...security, backupTime: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="retentionDays">Retention Period (days)</Label>
                          <Input id="retentionDays" type="number" placeholder="30" value={security.retentionDays} onChange={(e) => setSecurity({ ...security, retentionDays: Number(e.target.value) })} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-primary hover:bg-primary-dark" onClick={() => saveSettings({ security })}>
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}

export default Settings