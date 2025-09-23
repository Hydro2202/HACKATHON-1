import { useState } from "react"
import { Search, Filter, Plus, Clock, AlertTriangle, CheckCircle, Eye, MessageSquare } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { addComplaint, NewComplaint } from "@/lib/complaints"

// Mock data
const complaints = [
  {
    id: 1,
    unit: "12A",
    tenant: "Sarah Johnson",
    category: "Plumbing",
    title: "Kitchen sink leaking",
    description: "Water leaking from under the kitchen sink, getting worse daily",
    priority: "high",
    status: "pending",
    submissionDate: "2024-01-20",
    assignedTo: null,
    attachments: 2
  },
  {
    id: 2,
    unit: "8B",
    tenant: "Mike Chen",
    category: "Electrical",
    title: "Outlet not working in bedroom",
    description: "Main bedroom outlet stopped working after power outage",
    priority: "medium",
    status: "in-progress",
    submissionDate: "2024-01-19",
    assignedTo: "John Maintenance",
    attachments: 1
  },
  {
    id: 3,
    unit: "15A",
    tenant: "John Smith",
    category: "Noise",
    title: "Loud neighbors disrupting sleep",
    description: "Upstairs neighbors playing loud music after 10 PM regularly",
    priority: "low",
    status: "resolved",
    submissionDate: "2024-01-18",
    assignedTo: "Property Manager",
    attachments: 0
  },
  {
    id: 4,
    unit: "5C",
    tenant: "Emma Davis",
    category: "HVAC",
    title: "Air conditioning not cooling",
    description: "AC unit running but not producing cold air, room temperature rising",
    priority: "high",
    status: "pending",
    submissionDate: "2024-01-20",
    assignedTo: null,
    attachments: 3
  },
  {
    id: 5,
    unit: "20B",
    tenant: "Lisa Wong",
    category: "Appliance",
    title: "Dishwasher leaving spots on dishes",
    description: "Recently installed dishwasher not cleaning properly",
    priority: "low",
    status: "in-progress",
    submissionDate: "2024-01-17",
    assignedTo: "Appliance Tech",
    attachments: 1
  }
]

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-destructive text-destructive-foreground">High</Badge>
    case "medium":
      return <Badge className="bg-warning text-warning-foreground">Medium</Badge>
    case "low":
      return <Badge className="bg-muted text-muted-foreground">Low</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-destructive text-destructive-foreground">Pending</Badge>
    case "in-progress":
      return <Badge className="bg-warning text-warning-foreground">In Progress</Badge>
    case "resolved":
      return <Badge className="bg-success text-success-foreground">Resolved</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4 text-destructive" />
    case "in-progress":
      return <AlertTriangle className="w-4 h-4 text-warning" />
    case "resolved":
      return <CheckCircle className="w-4 h-4 text-success" />
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />
  }
}

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selected, setSelected] = useState<typeof complaints[number] | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState<NewComplaint>({
    unit: "",
    tenant: "",
    category: "General",
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    assignedTo: null,
  })

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <>
    <AppLayout>
      <div className="dashboard-bg min-h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Complaints Management</h1>
              <p className="text-muted-foreground mt-1">Track and resolve tenant complaints efficiently</p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark" onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Complaint
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                    <p className="text-3xl font-bold text-foreground">{complaints.length}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-destructive">{complaints.filter(c => c.status === 'pending').length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                    <p className="text-3xl font-bold text-warning">{complaints.filter(c => c.status === 'in-progress').length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                    <p className="text-3xl font-bold text-success">{complaints.filter(c => c.status === 'resolved').length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="card-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints by unit, tenant, category, or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Complaints ({filteredComplaints.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id} className="hover:bg-muted/50">
                        <TableCell className="font-semibold">#{complaint.id}</TableCell>
                        <TableCell className="font-medium">{complaint.unit}</TableCell>
                        <TableCell>{complaint.tenant}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{complaint.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div>
                            <p className="font-medium truncate">{complaint.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{complaint.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(complaint.status)}
                            {getStatusBadge(complaint.status)}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(complaint.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {complaint.assignedTo || <span className="text-muted-foreground">Unassigned</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelected(complaint)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {complaint.attachments > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {complaint.attachments} files
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>

    {/* Add Complaint */}
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Complaint</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          <Input placeholder="Tenant" value={form.tenant} onChange={(e) => setForm({ ...form, tenant: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="col-span-2" />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-2" />
          <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as any })}>
            <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={async () => { await addComplaint(form); setIsAddOpen(false) }}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complaint #{selected?.id}</DialogTitle>
          <DialogDescription>{selected?.title}</DialogDescription>
        </DialogHeader>
        {selected && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><span className="text-muted-foreground">Unit:</span> {selected.unit}</p>
            <p><span className="text-muted-foreground">Tenant:</span> {selected.tenant}</p>
            <p><span className="text-muted-foreground">Category:</span> {selected.category}</p>
            <p><span className="text-muted-foreground">Priority:</span> {selected.priority}</p>
            <p className="col-span-2"><span className="text-muted-foreground">Description:</span> {selected.description}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}

export default Complaints